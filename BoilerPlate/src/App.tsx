import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">React + Vite + ShadCN</h1>
          <p className="text-muted-foreground mb-4">
            Your project is ready! Here are some shadcn/ui components in action.
          </p>
          <div className="flex gap-2 justify-center">
            <Badge>New</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="outline">Tailwind v4</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles available out of the box</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>
                Buttons come in different sizes for various use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon">
                <span>🚀</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Cards can contain any content and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a card component with a header, content, and footer section. Perfect for
                displaying organized information.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge Collection</CardTitle>
              <CardDescription>Use badges to highlight important information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Badges work great for status indicators and labels
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
