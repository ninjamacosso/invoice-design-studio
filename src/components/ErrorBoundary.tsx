import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("App error:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold">Algo correu mal</h1>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message || "Ocorreu um erro inesperado. Tenta novamente."}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" onClick={() => window.location.assign("/")}>Voltar ao início</Button>
              <Button onClick={() => window.location.reload()}>Recarregar</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
