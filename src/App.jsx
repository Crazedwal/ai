import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">My Application</h1>
        <p className="text-muted-foreground">Start building something amazing</p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
}

export default App;
