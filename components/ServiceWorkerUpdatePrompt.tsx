"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ServiceWorkerUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const showPrompt = () => setUpdateAvailable(true);

    const checkInstalling = (worker: ServiceWorker | null) => {
      if (!worker || worker.state !== "installed") return;
      if (navigator.serviceWorker.controller) showPrompt();
    };

    const setup = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        showPrompt();
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            checkInstalling(newWorker);
          });
        }
      });
    };

    navigator.serviceWorker.ready
      .then((reg) => {
        setup(reg);

        reg.update().catch(() => {});
        interval = setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch(() => {});

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      if (interval) clearInterval(interval);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const reload = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        })
        .catch(() => {});
    }
    window.location.reload();
  };

  return (
    <Dialog open={updateAvailable} onOpenChange={setUpdateAvailable}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-amber-primary/10">
              <RefreshCw className="size-4 text-amber-primary" />
            </span>
            <DialogTitle className="font-serif text-lg">
              New version available
            </DialogTitle>
          </div>
          <DialogDescription>
            A new version of K &amp; S Beauty Centre is ready. Refresh to get the
            latest updates.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setUpdateAvailable(false)}
            className="gap-1.5"
          >
            <X className="size-4" />
            Dismiss
          </Button>
          <Button onClick={reload} className="gap-1.5">
            <RefreshCw className="size-4" />
            Refresh Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}