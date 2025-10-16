import { format } from "date-fns";

interface StatusChange {
  status: string;
  timestamp: Date;
  reason?: string;
}

interface StatusHistoryProps {
  history: StatusChange[];
}

export function StatusHistory({ history }: StatusHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="md:col-span-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Status History</h3>
      <div className="space-y-2">
        {history.map((change, index) => (
          <div key={index} className="text-sm border-l-2 border-gray-200 pl-4 py-2">
            <p>
              <span className="font-medium">Status:</span> {change.status}
            </p>
            <p>
              <span className="font-medium">Date:</span> {format(change.timestamp, "PPP p")}
            </p>
            {change.reason && (
              <p>
                <span className="font-medium">Reason:</span> {change.reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}