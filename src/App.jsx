import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Tailwind CSS & shadcn/ui Showcase
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        A comprehensive showcase of Tailwind CSS utilities and shadcn/ui components
      </p>

      {/* ========== shadcn/ui Components Section ========== */}
      <div className="bg-slate-100 -mx-8 px-8 py-12 mb-16 border-l-4 border-blue-600">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            shadcn/ui Components
          </h1>
          <p className="text-gray-600">
            Pre-built, accessible components using Radix UI and Tailwind CSS
          </p>
        </div>

        {/* Button Component Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
            Button Component
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Button Variants</p>
              <p className="text-xs text-gray-500 mb-4">Different visual styles for various use cases</p>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Button Sizes</p>
              <p className="text-xs text-gray-500 mb-4">Three size options for different contexts</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Disabled State</p>
              <p className="text-xs text-gray-500 mb-4">Buttons automatically handle disabled states</p>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled Default</Button>
                <Button variant="destructive" disabled>Disabled Destructive</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Component Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
            Badge Component
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Badge Variants</p>
              <p className="text-xs text-gray-500 mb-4">Small labels for tags, status, and counts</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Use Case Examples</p>
              <p className="text-xs text-gray-500 mb-4">Badges in real-world scenarios</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge>Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Categories:</span>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Notifications:</span>
                  <Badge>5 new</Badge>
                  <Badge variant="secondary">12 unread</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Component Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
            Card Component
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Basic Card Structure</p>
              <p className="text-xs text-gray-500 mb-4">Card with header, content, and footer</p>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    This is the main content area of the card. You can add any content here including text, images, or other components.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Continue</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Card Grid Layout</p>
              <p className="text-xs text-gray-500 mb-4">Multiple cards in a responsive grid</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature One</CardTitle>
                    <CardDescription>First feature description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Quick and efficient workflow.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Two</CardTitle>
                    <CardDescription>Second feature description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Beautiful and accessible design.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Three</CardTitle>
                    <CardDescription>Third feature description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Built with modern technologies.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">Card with Badges</p>
              <p className="text-xs text-gray-500 mb-4">Combining cards with other components</p>
              <Card className="max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Status</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>Current project overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tasks completed:</span>
                      <Badge variant="secondary">24/30</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Priority:</span>
                      <Badge variant="destructive">High</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* ========== Visual Separator ========== */}
      <div className="my-16 border-t-4 border-gray-300"></div>

      {/* ========== Tailwind CSS Utility Classes Section ========== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tailwind CSS Utility Classes
        </h1>
        <p className="text-gray-600">
          Core Tailwind CSS utilities for styling and layout
        </p>
      </div>

      {/* Background Colors Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Background Colors
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-6 rounded-lg">
            <span className="font-medium">bg-blue-500:</span> Blue background
          </div>
          <div className="bg-red-100 text-red-900 p-6 rounded-lg">
            <span className="font-medium">bg-red-100:</span> Light red background
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <span className="font-medium">bg-gray-900:</span> Dark gray background
          </div>
        </div>
      </section>

      {/* Text Colors Section */}
      <section className="mb-16 bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white border-b-2 border-blue-500 pb-2">
          Text Colors
        </h2>
        <div className="space-y-4">
          <p className="text-white text-xl">
            <span className="font-medium">text-white:</span> White text
          </p>
          <p className="text-gray-600 text-xl bg-white p-2 rounded">
            <span className="font-medium">text-gray-600:</span> Gray text
          </p>
          <p className="text-blue-500 text-xl">
            <span className="font-medium">text-blue-500:</span> Blue text
          </p>
        </div>
      </section>

      {/* Flexbox Layout Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Flexbox Layouts
        </h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-2">flex items-center justify-between</p>
            <div className="flex items-center justify-between bg-blue-100 p-4 rounded">
              <span className="bg-blue-500 text-white px-4 py-2 rounded">Left</span>
              <span className="bg-blue-500 text-white px-4 py-2 rounded">Right</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-2">flex justify-center items-center gap-4</p>
            <div className="flex justify-center items-center gap-4 bg-green-100 p-4 rounded">
              <span className="bg-green-500 text-white px-4 py-2 rounded">Item 1</span>
              <span className="bg-green-500 text-white px-4 py-2 rounded">Item 2</span>
              <span className="bg-green-500 text-white px-4 py-2 rounded">Item 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Grid Layouts
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">grid grid-cols-3 gap-4</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-500 text-white p-6 rounded text-center font-bold">1</div>
              <div className="bg-purple-500 text-white p-6 rounded text-center font-bold">2</div>
              <div className="bg-purple-500 text-white p-6 rounded text-center font-bold">3</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">grid grid-cols-2 gap-6</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-indigo-500 text-white p-6 rounded text-sm">Column 1</div>
              <div className="bg-indigo-500 text-white p-6 rounded text-sm">Column 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Borders & Rounded Corners Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Borders & Rounded Corners
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">border border-gray-300 rounded-lg</p>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              Bordered box with rounded corners
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">border-2 border-blue-500 rounded-xl</p>
            <div className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50">
              Thicker blue border with extra rounded corners
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">rounded-full (circle)</p>
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex items-center justify-center text-white font-bold">
              Circle
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">rounded-none</p>
            <div className="border border-gray-400 rounded-none p-4 bg-gray-50">
              No rounded corners (sharp edges)
            </div>
          </div>
        </div>
      </section>

      {/* Interactive States Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Interactive States (Hover, Focus, Active)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">Hover State</p>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors duration-200">
              Hover over me
            </button>
            <p className="text-xs text-gray-500 mt-2">Changes from blue-500 to blue-700</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">Focus State</p>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded transition-colors duration-200"
              placeholder="Click to focus"
            />
            <p className="text-xs text-gray-500 mt-2">Border turns blue when focused</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">Active State</p>
            <button className="w-full bg-green-500 active:bg-green-800 text-white font-bold py-3 px-6 rounded">
              Click and hold me
            </button>
            <p className="text-xs text-gray-500 mt-2">Darkens while being clicked</p>
          </div>
        </div>
      </section>

      {/* Responsive Design Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Responsive Design (Resize browser to see)
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 mb-4">
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
          </p>
          <p className="text-xs text-gray-500 mb-4">
            1 column on mobile, 2 on tablet (md), 3 on desktop (lg)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-cyan-500 text-white p-6 rounded text-center">Card 1</div>
            <div className="bg-cyan-500 text-white p-6 rounded text-center">Card 2</div>
            <div className="bg-cyan-500 text-white p-6 rounded text-center">Card 3</div>
          </div>
        </div>
      </section>

      {/* Dark Mode Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Dark Mode Support
        </h2>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            bg-white dark:bg-gray-900 text-black dark:text-white
          </p>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded border border-gray-300 dark:border-gray-600">
            <h3 className="text-xl font-bold mb-2">This adapts to dark mode!</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Enable dark mode in your system settings to see the transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Spacing & Sizing Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Spacing & Sizing
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">Padding variants</p>
            <div className="space-y-2">
              <div className="bg-orange-200 p-2 inline-block rounded">p-2 (padding: 0.5rem)</div>
              <div className="bg-orange-300 p-4 inline-block rounded ml-4">p-4 (padding: 1rem)</div>
              <div className="bg-orange-400 p-8 inline-block rounded ml-4">p-8 (padding: 2rem)</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">Margin variants (space-y-*)</p>
            <div className="space-y-2">
              <div className="bg-teal-500 text-white p-3 rounded">Item with space-y-2</div>
              <div className="bg-teal-500 text-white p-3 rounded">Item with space-y-2</div>
            </div>
            <div className="space-y-6 mt-6">
              <div className="bg-teal-600 text-white p-3 rounded">Item with space-y-6</div>
              <div className="bg-teal-600 text-white p-3 rounded">Item with space-y-6</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shadow Effects Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Shadow Effects
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <p className="font-medium">shadow-sm</p>
            <p className="text-xs text-gray-500">Small shadow</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <p className="font-medium">shadow-md</p>
            <p className="text-xs text-gray-500">Medium shadow</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="font-medium">shadow-lg</p>
            <p className="text-xs text-gray-500">Large shadow</p>
          </div>
          <div className="bg-white shadow-2xl p-6 rounded-lg">
            <p className="font-medium">shadow-2xl</p>
            <p className="text-xs text-gray-500">Extra large</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
