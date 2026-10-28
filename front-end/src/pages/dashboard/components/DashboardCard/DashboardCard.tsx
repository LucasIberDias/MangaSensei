import "./DashboardCard.css";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  value: React.ReactNode;
  bottom?: React.ReactNode;
  progress?: number;
}

export function DashboardCard({
  title,
  icon,
  color,
  value,
  bottom,
  progress,
}: DashboardCardProps) {
  return (
    <div
      className="dashboard-card"
      style={{
        "--card-color": color,
      } as React.CSSProperties}
    >
      <div className="dashboard-card__icon">
        {icon}
      </div>

      <div className="dashboard-card__content">
        <span className="dashboard-card__title">
          {title}
        </span>

        <strong className="dashboard-card__value">
          {value}
        </strong>

        {progress !== undefined ? (
          <div className="dashboard-card__progress-container">
            <span>{progress}%</span>

            <div className="dashboard-card__progress">
              <div
                className="dashboard-card__progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          bottom && (
            <span className="dashboard-card__bottom">
              {bottom}
            </span>
          )
        )}
      </div>
    </div>
  );
}