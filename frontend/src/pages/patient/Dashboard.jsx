import React, { useState } from "react";
import DynamicMedicationsChart from "../../Components/PatientComponents/dashboardcomponents/medicationschart/DynamicMedicationsChart";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import NotificationsDropdown from "../../Components/PatientComponents/dashboardcomponents/NotificationsDropdown";
import AppointmentsList from "@/components/PatientComponents/dashboardcomponents/appointments/AppointmentsList";

export default function DashboardP() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lineChartPeriod, setLineChartPeriod] = useState("daily"); // Default = daily

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mon tableau de bord</h1>
        <NotificationsDropdown />
      </div>

      {/* Medications Chart */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Suivi des médicaments</h2>

          {/* Period Select */}
          <Select value={lineChartPeriod}  onValueChange={setLineChartPeriod}>
            <SelectTrigger className="w-40 text-md">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="text-white text-md">
              <SelectItem className="text-md" value="daily">Quotidien</SelectItem>
              <SelectItem className="text-md" value="weekly">Hebdomadaire</SelectItem>
              <SelectItem className="text-md" value="monthly">Mensuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        <DynamicMedicationsChart period={lineChartPeriod} />
      </section>

      {/* Appointments */}
      <AppointmentsList selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </div>
  );
}
