import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  id: string;
  label: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
  status?: "live" | "coming_soon" | "stub";
}

export function ModuleCard({
  label,
  description,
  href,
  color,
  bgColor,
  status = "stub",
}: ModuleCardProps) {
  const statusLabel =
    status === "live" ? "Live" : status === "coming_soon" ? "Coming Soon" : "Stub";
  const statusVariant =
    status === "live" ? "success" : status === "coming_soon" ? "warning" : "stub";

  return (
    <Card className="flex flex-col transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", bgColor)}>
            <span className={cn("text-lg font-bold", color)}>{label[0]}</span>
          </div>
          <Badge variant={statusVariant as "stub"}>{statusLabel}</Badge>
        </div>
        <CardTitle className="mt-3 text-lg">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={href}>
            Open Module <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
