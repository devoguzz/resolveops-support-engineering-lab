import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: ReactNode
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  footerText?: string
}

export function MetricCard({ title, value, icon: Icon, trend, footerText }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(trend || footerText) && (
          <p className="mt-1 flex items-center text-xs">
            {trend && (
              <span
                className={`font-medium ${
                  trend.positive ? "text-success" : "text-destructive"
                }`}
              >
                {trend.value}
              </span>
            )}
            {footerText && (
              <span className="text-muted-foreground ml-1">{footerText}</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
