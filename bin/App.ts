import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Text, useApp, useInput } from "ink";
import fs from "fs";
import { COPY, type InstallScope, type Platform } from "./lib/constants.js";
import {
  readPackageJson,
  readMeta,
  detectInstalledPlatform,
  writeMeta,
  summarizePlan,
  fetchNpmHash,
  fetchNpmLatestVersion,
  isAllowedInstallPath,
  sleep,
  copyDir,
  copyFile,
  migrateLegacyMemoryVault,
} from "./lib/utils.js";
import { getCodexPlan } from "./lib/plans.js";
import { getFooterHints } from "./lib/hints.js";
import { Frame, Section } from "./components/Layout.js";
import { Header } from "./components/Header.js";
import { KeyHints, ScopeStep } from "./components/Options.js";
import { InstallPreview, ExistingInstallView, UpToDateView, UpdateMissingView } from "./components/Preview.js";
import { ProgressView } from "./components/Progress.js";
import { SuccessView } from "./components/Success.js";
import { Spinner } from "@inkjs/ui";
import type {
  AppStep,
  InstallPlan,
  InstallMeta,
  InstallStepResult,
  PlanSummary,
} from "./lib/types.js";

const h = React.createElement;

function useCompactLayout() {
  const read = () => ({
    width:  process.stdout.columns ?? 120,
    height: process.stdout.rows    ?? 30,
  });
  const [dims, setDims] = useState(read);

  useEffect(() => {
    const update = () => setDims(read());
    process.stdout.on("resize", update);
    return () => {
      process.stdout.off("resize", update);
    };
  }, []);

  return {
    width:   dims.width,
    height:  dims.height,
    compact: dims.height < 40,
  };
}

function isInstallScope(value: string): value is InstallScope {
  return value === "orchestration" || value === "lean" || value === "skills-memory" || value === "skills";
}

interface AppProps {
  force?: boolean;
}

export function App({ force = false }: AppProps): React.ReactElement {
  const { exit } = useApp();
  const { compact } = useCompactLayout();
  const pkg = useMemo(() => readPackageJson(), []);
  const cwd = process.cwd();
  const escapeLockUntil = useRef(0);

  const [step,           setStep]           = useState<AppStep>("scope");
  const [scope,          setScope]          = useState<InstallScope>("orchestration");
  const platform: Platform = "codex";
  const [plan,           setPlan]           = useState<InstallPlan | null>(null);
  const [existing,       setExisting]       = useState<InstallMeta | null>(null);
  const [aborted,        setAborted]        = useState(false);
  const [installSteps,   setInstallSteps]   = useState<InstallStepResult[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [totalFiles,     setTotalFiles]     = useState(0);
  const [hash,           setHash]           = useState<string | null>(null);
  const [fetchingHash,   setFetchingHash]   = useState(false);
  const [missing,        setMissing]        = useState<string[]>([]);
  const [preview,        setPreview]        = useState<PlanSummary | null>(null);
  const [updateChecking, setUpdateChecking] = useState(force);
  const [latestVersion,  setLatestVersion]  = useState<string | null>(null);

  const resetPreparedState = () => {
    setPlan(null);
    setPreview(null);
    setExisting(null);
  };

  const abortInstall = () => {
    setAborted(true);
    setTimeout(() => exit(), 100);
  };

  const goBack = (currentStep: AppStep): boolean => {
    if (currentStep === "confirm") {
      resetPreparedState();
      setStep("scope");
      return true;
    }

    return false;
  };

  const lockEscape = () => {
    escapeLockUntil.current = Date.now() + 250;
  };

  useInput((input, key) => {
    const isEscape = key.escape || input === "\u001B";

    if (isEscape && Date.now() < escapeLockUntil.current) {
      return;
    }

    // Block all input while the update check async is in flight
    if (force && updateChecking) {
      if (input === "q" || input === "Q" || isEscape) {
        exit();
      }
      return;
    }

    if (input === "q" || input === "Q") {
      if (step === "done" || step === "existing" || step === "up-to-date" || step === "update-missing") {
        exit();
        return;
      }
      abortInstall();
      return;
    }

    if (step === "confirm") {
      if (isEscape) {
        const movedBack = goBack(step);
        if (movedBack) {
          lockEscape();
        }
        return;
      }
      if (key.return || input === "y" || input === "Y") {
        setStep("install");
        return;
      }
      if (input === "n" || input === "N") {
        abortInstall();
        return;
      }
      return;
    }

    if (isEscape) {
      if (step === "install") {
        abortInstall();
        lockEscape();
        return;
      }

      if (step === "scope") {
        abortInstall();
        lockEscape();
        return;
      }

      const movedBack = goBack(step);
      if (movedBack) {
        lockEscape();
        return;
      }

      if (!movedBack && step !== "done" && step !== "existing" && step !== "up-to-date" && step !== "update-missing") {
        abortInstall();
        lockEscape();
      }
    }
  });

  const preparePlan = (nextScope: InstallScope): void => {
    const nextPlan: InstallPlan = getCodexPlan(cwd, nextScope);

    setScope(nextScope);
    setPlan(nextPlan);
    setPreview(summarizePlan(nextPlan, nextScope));

    const detected = readMeta(nextPlan.metaDir);
    setExisting(detected);

    if (detected && detected.platform === platform && detected.scope === nextScope && !force) {
      setStep("existing");
      setTimeout(() => exit(), 100);
      return;
    }

    setStep("confirm");
  };

  useEffect(() => {
    if (!force) {
      return;
    }

    let cancelled = false;

    const resolveUpdateFlow = async () => {
      const detected = detectInstalledPlatform(cwd);

      if (!detected) {
        setUpdateChecking(false);
        setStep("update-missing");
        setTimeout(() => exit(), 1200);
        return;
      }

      setExisting(detected.meta);
      setScope(detected.meta.scope);

      const npmLatest = await fetchNpmLatestVersion();
      if (cancelled) {
        return;
      }

      if (npmLatest) {
        setLatestVersion(npmLatest);
        if (detected.meta.version === npmLatest) {
          setUpdateChecking(false);
          setStep("up-to-date");
          return;
        }
      }

      setUpdateChecking(false);
      preparePlan(detected.meta.scope);
    };

    resolveUpdateFlow();
    return () => {
      cancelled = true;
    };
  }, [cwd, force, exit]);

  useEffect(() => {
    if (step !== "install" || !plan) return;

    let cancelled = false;

    const runInstall = async () => {
      const results: InstallStepResult[] = [];
      let total = 0;
      const missingItems: string[] = [];

      for (let i = 0; i < plan.steps.length; i++) {
        if (cancelled) return;
        setCurrentStepIdx(i);
        const s = plan.steps[i];

        if (!s.src || !fs.existsSync(s.src)) {
          missingItems.push(s.label);
          continue;
        }

        await sleep(250);

        let countMsg = "";
        if ("destDir" in s && s.destDir) {
          if (!isAllowedInstallPath(cwd, s.destDir)) {
            countMsg = "blocked (unsafe path)";
            results.push({ label: s.label, msg: countMsg });
            setInstallSteps([...results]);
            continue;
          }

          const migratedMemory = s.legacyMemoryDirs
            ? migrateLegacyMemoryVault(cwd, s.destDir, s.legacyMemoryDirs)
            : null;

          if (migratedMemory) {
            total += migratedMemory.count;
            countMsg = `migrated from ${migratedMemory.from}`;
          } else if (s.skipIfExists && fs.existsSync(s.destDir)) {
            countMsg = "skipped (already exists)";
          } else {
            const count = copyDir(s.src, s.destDir, s.transform);
            total += count;
            countMsg = `${count} file${count === 1 ? "" : "s"}`;
          }
        } else if ("destFile" in s && s.destFile) {
          if (!isAllowedInstallPath(cwd, s.destFile)) {
            countMsg = "blocked (unsafe path)";
            results.push({ label: s.label, msg: countMsg });
            setInstallSteps([...results]);
            continue;
          }

          if (s.skipIfExists && fs.existsSync(s.destFile)) {
            countMsg = "skipped (already exists)";
          } else {
            copyFile(s.src, s.destFile);
            total++;
            countMsg = "1 file";
          }
        }

        results.push({ label: s.label, msg: countMsg });
        setInstallSteps([...results]);
        setTotalFiles(total);
        await sleep(50);
      }

      setMissing(missingItems);
      setCurrentStepIdx(-1);
      setFetchingHash(true);
      const nextHash = await fetchNpmHash(pkg.version);
      if (cancelled) return;

      setHash(nextHash);
      setFetchingHash(false);
      if (!isAllowedInstallPath(cwd, plan.metaDir)) {
        setStep("done");
        setTimeout(() => exit(), 100);
        return;
      }

      writeMeta(plan.metaDir, {
        version:      pkg.version,
        installedAt:  new Date().toISOString(),
        source:       "AshenDulsanka/agent-arche",
        sourceType:   "npm",
        scope,
        platform,
        hash:         nextHash ?? null,
      });
      setStep("done");
      setTimeout(() => exit(), 100);
    };

    runInstall();
    return () => { cancelled = true; };
  }, [pkg.version, plan, platform, step, exit, scope]);

  return h(
    Box,
    { paddingX: 1, paddingY: compact ? 0 : 1, flexDirection: "column" },
    h(
      Frame,
      null,
      h(Header, { version: pkg.version, force, cwd, step, compact, showSteps: !force }),

      aborted
        ? h(Section, { eyebrow: COPY.cancelled.eyebrow, title: COPY.cancelled.title },
            h(Text, { color: "gray" }, COPY.cancelled.message)
          )
        : null,

      !aborted && force && updateChecking
        ? h(Section, { eyebrow: "UPDATE", title: COPY.install.updateChecking },
            h(Box, { marginTop: 0 },
              h(Spinner, { type: "dots" }),
              h(Text, { color: "gray" }, "  npm registry")
            )
          )
        : null,

      !aborted && !force && step === "scope"
        ? h(ScopeStep, {
            value: scope,
            compact,
            onChange: setScope,
            onSubmit: (value: string) => {
              if (!isInstallScope(value)) {
                return;
              }

              setScope(value);
              preparePlan(value);
            },
          })
        : null,

      !aborted && step === "existing"
        ? h(ExistingInstallView, { platform, existing, compact })
        : null,

      !aborted && step === "up-to-date" && latestVersion
        ? h(UpToDateView, { platform, existing, latestVersion, compact })
        : null,

      !aborted && step === "update-missing"
        ? h(UpdateMissingView, { compact })
        : null,

      !aborted && step === "confirm" && preview && plan
        ? h(InstallPreview, {
            scope,
            platform,
            plan,
            preview,
            force,
            compact,
            onConfirm: (value: boolean) => {
              if (value) { setStep("install"); return; }
              abortInstall();
            },
          })
        : null,

      !aborted && step === "install" && plan
        ? h(ProgressView, { plan, installSteps, currentStepIdx, fetchingHash, totalFiles, compact })
        : null,

      !aborted && step === "done" && plan
        ? h(SuccessView, { platform, plan, totalFiles, hash, missing, force, compact })
        : null,

      h(KeyHints, { hints: getFooterHints(step) })
    )
  );
}
