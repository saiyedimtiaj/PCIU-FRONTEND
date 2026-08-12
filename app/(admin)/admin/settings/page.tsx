import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings | Admin | Port City International University",
};

function Field({
  label,
  defaultValue,
  helper,
}: {
  label: string;
  defaultValue: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input defaultValue={defaultValue} className="mt-1.5" />
      {helper && <p className="text-xs text-muted-foreground mt-1.5">{helper}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="w-full p-6 space-y-6">
      <p className="text-sm text-muted-foreground">
        Global site information used across the public pages.
      </p>

      <Card>
        <CardContent className="space-y-5">
          <h2 className="font-heading font-semibold text-foreground">Site Information</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Site Name" defaultValue="Port City International University" />
            <Field label="Short Name" defaultValue="PCIU" />
            <Field label="Contact Email" defaultValue="admission@portcity.edu.bd" />
            <Field label="Contact Phone" defaultValue="+8801851120791" />
          </div>
          <Field
            label="Tagline"
            defaultValue="Where the Bay Meets Brilliance"
            helper="Shown in the hero section and browser tab titles."
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5">
            <h2 className="font-heading font-semibold text-foreground">Address</h2>
            <Field
              label="Campus Address"
              defaultValue="7-14, Nikunja Housing Society, South Khulshi, Chattogram, Bangladesh"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5">
            <h2 className="font-heading font-semibold text-foreground">Social Links</h2>
            <Field label="Facebook" defaultValue="https://facebook.com" />
            <Field label="Instagram" defaultValue="https://instagram.com" />
            <Field label="LinkedIn" defaultValue="https://linkedin.com" />
            <Field label="YouTube" defaultValue="https://youtube.com" />
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard Changes</Button>
        <Button variant="highlight">Save Settings</Button>
      </div>
    </div>
  );
}
