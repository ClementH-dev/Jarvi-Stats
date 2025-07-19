export const MetricCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  subtitle,
  trend,
}: {
  title: string
  value: string
  icon: string
  iconBg: string
  iconColor: string
  subtitle: string
  trend?: "positive" | "negative" | "neutral"
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <span className={`text-xl ${iconColor}`}>{icon}</span>
      </div>
      {trend && (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            trend === "positive"
              ? "bg-green-100 text-green-700"
              : trend === "negative"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {trend === "positive" ? "↗️" : trend === "negative" ? "↘️" : "→"}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
)