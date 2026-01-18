import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Check, Apple, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    "Faster loading & offline access",
    "Push notifications for order updates",
    "Quick access from home screen",
    "Seamless trading experience",
    "Works on iOS, Android & Desktop"
  ];

  return (
    <>
      <Helmet>
        <title>Install gXchange App | iOS & Android</title>
        <meta
          name="description"
          content="Install the gXchange app on your phone for faster gift card trading. Works on iOS, Android, and Desktop."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Hero */}
            <div className="mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Get the gXchange App
              </h1>
              <p className="text-lg text-muted-foreground">
                Install our app for the best trading experience on your device
              </p>
            </div>

            {/* Features */}
            <div className="bg-card rounded-2xl p-8 mb-8 border">
              <h2 className="text-xl font-semibold mb-6">Why Install?</h2>
              <ul className="space-y-4 text-left">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Install Instructions */}
            {isInstalled ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-500 mb-2">
                  App Installed!
                </h2>
                <p className="text-muted-foreground">
                  gXchange is already installed on your device. Open it from your home screen.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Android/Desktop Install Button */}
                {deferredPrompt && (
                  <Button
                    size="lg"
                    onClick={handleInstall}
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-xl gap-3"
                  >
                    <Download className="w-6 h-6" />
                    Install gXchange App
                  </Button>
                )}

                {/* iOS Instructions */}
                {isIOS && (
                  <div className="bg-card rounded-2xl p-8 border text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Apple className="w-8 h-8" />
                      <h3 className="text-xl font-semibold">Install on iPhone/iPad</h3>
                    </div>
                    <ol className="space-y-4 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                        <span>Tap the <strong className="text-foreground">Share</strong> button in Safari (box with arrow)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                        <span>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                        <span>Tap <strong className="text-foreground">"Add"</strong> to install the app</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Desktop/Other Instructions */}
                {!isIOS && !deferredPrompt && (
                  <div className="bg-card rounded-2xl p-8 border text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <Monitor className="w-8 h-8" />
                      <h3 className="text-xl font-semibold">Install on Desktop</h3>
                    </div>
                    <ol className="space-y-4 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                        <span>Look for the <strong className="text-foreground">install icon</strong> in your browser's address bar</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                        <span>Or click the <strong className="text-foreground">menu (⋮)</strong> and select "Install gXchange"</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                        <span>Click <strong className="text-foreground">"Install"</strong> to add to your desktop</span>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Install;
