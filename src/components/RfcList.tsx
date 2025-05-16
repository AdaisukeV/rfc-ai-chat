import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RfcList({ rfcNumbers }: { rfcNumbers: number[] }) {
  return (
    <Card className="w-80 bg-zinc-950 border-0">
      <CardHeader>
        <CardTitle>学習済みRFC一覧</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-y-auto">
        <ul className="list-disc pl-5">
          {rfcNumbers.map((rfcNumber) => (
            <li key={rfcNumber}>
              <a
                href={`https://datatracker.ietf.org/doc/html/rfc${rfcNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                RFC {rfcNumber}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}