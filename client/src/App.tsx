import { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CreatorCreditsPage from "./pages/CreatorCreditsPage";
import { IntroPreloader } from "./components/IntroPreloader";
import { CustomCursor } from "./components/CustomCursor";
import { SmoothScroll } from "./components/SmoothScroll";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/credits"} component={CreatorCreditsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          {/* Awwwards $10,000 Premium Animations Suite */}
          {!preloaderComplete && <IntroPreloader onComplete={() => setPreloaderComplete(true)} />}
          <CustomCursor />
          <div className="paper-grain" />
          
          <SmoothScroll>
            <Toaster />
            <Router />
          </SmoothScroll>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
