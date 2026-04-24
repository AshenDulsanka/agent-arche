import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Text, useApp, useInput } from "ink";
import fs from "fs";
import { COPY, type Platform, type Subscription } from "./lib/constants.js";
import {
  readPackageJson,
  readMeta,
  detectInstalledPlatform,
  writeMeta,
  summarizePlan,
  fetchNpmHash,
  sleep,
  copyDir,
  copyFile,
} from "./lib/utils.js";
import { getCopilotPlan, getClaudePlan, getCodexPlan } from "./lib/plans.js";
import { getFooterHints } from "./lib/hints.js";
import { Frame, Section } from "./components/Layout.js";
import { Header } from "./components/Header.js";
import { KeyHints, PlatformCards, SubscriptionStep } from "./components/Options.js";
import { InstallPreview, ExistingInstallView } from "./components/Preview.js";
import { ProgressView } from "./components/Progress.js";
import { SuccessView } from "./components/Success.js";
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

function isPlatform(value: string): value is Platform {
  return value === "copilot" || value === "claude" || value === "codex";
}

function isSubscription(value: string): value is Subscription {
  return value === "auto" || value === "student" || value === "pro" || value === "pro+";
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

  const [step,           setStep]           = useState<AppStep>("platform");
  const [platform,       setPlatform]       = useState<Platform>("copilot");
  const [subscription,   setSubscription]   = useState<Subscription>("auto");
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
  const [updateResolved, setUpdateResolved] = useState(false);

  const resetPreparedState = () => {
    setPlan(null);
    setPreview(null);
    setExisting(null);
  };

  const abortInstall = () => {
    setAborted(true);
    setTimeout(() => exit(), 100);
  };

  const goBack = (currentStep: AppStep, currentPlatform: Platform): boolean => {
    if (currentStep === "subscription") {
      setStep("platform");
      return true;
    }

    if (currentStep === "confirm") {
      resetPreparedState();
      setStep(currentPlatform === "copilot" ? "subscription" : "platform");
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

    if (input === "q" || input === "Q") {
      if (step === "done" || step === "existing") {
        exit();
        return;
      }
      abortInstall();
      return;
    }

    if (step === "confirm") {
      if (isEscape) {
        const movedBack = goBack(step, platform);
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

      if (step === "platform") {
        abortInstall();
        lockEscape();
        return;
      }

      const movedBack = goBack(step, platform);
      if (movedBack) {
        lockEscape();
        return;
      }

      if (!movedBack && step !== "done" && step !== "existing") {
        abortInstall();
        lockEscape();
      }
    }
  });

  const preparePlan = (nextPlatform: Platform, nextSubscription: Subscription): void => {
    let nextPlan: InstallPlan;
    if      (nextPlatform === "copilot") nextPlan = getCopilotPlan(cwd, nextSubscription);
    else if (nextPlatform === "claude")  nextPlan = getClaudePlan(cwd);
    else                                  nextPlan = getCodexPlan(cwd);

    setPlatform(nextPlatform);
    setSubscription(nextSubscription);
    setPlan(nextPlan);
    setPreview(summarizePlan(nextPlan, nextPlatform, nextSubscription));

    const detected = readMeta(nextPlan.metaDir);
    setExisting(detected);

    if (detected && detected.platform === nextPlatform && !force) {
      setStep("existing");
      setTimeout(() => exit(), 100);
      return;
    }

    setStep("confirm");
  };

  useEffect(() => {
    if (!force || updateResolved) {
      return;
    }

    const detected = detectInstalledPlatform(cwd);
    setUpdateResolved(true);

    if (!detected) {
      return;
    }

    setExisting(detected.meta);
    preparePlan(detected.platform, detected.subscription);
  }, [cwd, force, updateResolved]);

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
          if (s.skipIfExists && fs.existsSync(s.destDir)) {
            countMsg = "skipped (already exists)";
          } else {
            const count = copyDir(s.src, s.destDir, s.transform);
            total += count;
            countMsg = `${count} file${count === 1 ? "" : "s"}`;
          }
        } else if ("destFile" in s && s.destFile) {
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
      writeMeta(plan.metaDir, {
        version:      pkg.version,
        installedAt:  new Date().toISOString(),
        source:       "AshenDulsanka/agent-arche",
        sourceType:   "npm",
        platform,
        subscription: platform === "copilot" ? subscription : undefined,
        hash:         nextHash ?? null,
      });
      setStep("done");
      setTimeout(() => exit(), 100);
    };

    runInstall();
    return () => { cancelled = true; };
  }, [pkg.version, plan, platform, step, exit, subscription]);

  return h(
    Box,
    { paddingX: 1, paddingY: compact ? 0 : 1, flexDirection: "column" },
    h(
      Frame,
      null,
      h(Header, { version: pkg.version, force, cwd, step, platform, compact }),

      aborted
        ? h(Section, { eyebrow: COPY.cancelled.eyebrow, title: COPY.cancelled.title },
            h(Text, { color: "gray" }, COPY.cancelled.message)
          )
        : null,

      !aborted && (!force || updateResolved) && step === "platform"
        ? h(PlatformCards, {
            value: platform,
            compact,
            onChange: setPlatform,
            onSubmit: (value: string) => {
              if (!isPlatform(value)) {
                return;
              }
              if (value === "copilot") { setPlatform(value); setStep("subscription"); return; }
              preparePlan(value, "auto");
            },
          })
        : null,

      !aborted && (!force || updateResolved) && step === "subscription"
        ? h(SubscriptionStep, {
            value: subscription,
            compact,
            onSubmit: (value: string) => {
              if (!isSubscription(value)) {
                return;
              }
              preparePlan("copilot", value);
            },
          })
        : null,

      !aborted && step === "existing"
        ? h(ExistingInstallView, { platform, existing, compact })
        : null,

      !aborted && step === "confirm" && preview && plan
        ? h(InstallPreview, {
            platform,
            subscription,
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
