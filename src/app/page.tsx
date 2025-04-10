import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-red-600">Resume-AI</h1>
      <Button variant="outline" className="cursor-pointer">Click me</Button>
    </main>
  )
}
