"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line } from "react-chartjs-2"; // Import Line chart from react-chartjs-2
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

interface PreRetirementData {
  age: number;
  totalInvestment: number;
  contributions: number;
  expenses: number;
}

export function RetirementCalculatorComponent() {
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(20000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(3);
  const [preRetirementData, setPreRetirementData] = useState<
    PreRetirementData[]
  >([]); // State for pre-retirement data

  const formatNumberWithCommas = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numericValue = value.replace(/,/g, ""); // Remove commas
    setter(numericValue ? Number(numericValue) : 0);
  };

  const calculateRetirementIncome = (age: number) => {
    const yearsUntilRetirement = Math.max(0, age - currentAge);
    const adjustedAnnualExpenses =
      annualExpenses * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
    const adjustedSocialSecurityBenefit =
      socialSecurityBenefit *
      Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    // Use the original annual contribution without inflation adjustment
    const totalSavings =
      currentSavings *
        Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) +
      (age <= 65
        ? annualContribution *
          ((Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) - 1) /
            (expectedReturn / 100))
        : 0);

    const annualInvestmentIncome = totalSavings * 0.04;
    const totalAnnualIncome =
      annualInvestmentIncome + adjustedSocialSecurityBenefit;
    const netIncome = totalAnnualIncome - adjustedAnnualExpenses;

    return {
      totalSavings: Math.round(totalSavings),
      investmentIncome: Math.round(annualInvestmentIncome),
      socialSecurity: adjustedSocialSecurityBenefit,
      totalIncome: Math.round(totalAnnualIncome),
      expenses: adjustedAnnualExpenses,
      netIncome: Math.round(netIncome),
    };
  };

  const calculateRetirementProjections = (startAge: number) => {
    const projections = [];
    for (let i = 0; i < 30; i++) {
      const age = startAge + i;
      const income = calculateRetirementIncome(age);
      projections.push({
        age,
        totalSavings: income.totalSavings,
        investmentIncome: income.investmentIncome,
        socialSecurity: income.socialSecurity,
        totalIncome: income.totalIncome,
        expenses: income.expenses,
        netIncome: income.netIncome,
      });
    }
    return projections;
  };

  const retirementProjections = calculateRetirementProjections(65).filter(
    (projection) => [65, 70, 75, 80].includes(projection.age)
  );

  // Prepare data for the chart
  const chartData = {
    labels: retirementProjections.map((projection) =>
      projection.age.toString()
    ),
    datasets: [
      {
        label: "Total Income",
        data: retirementProjections.map((projection) => projection.totalIncome),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Expenses",
        data: retirementProjections.map((projection) => projection.expenses),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Net Income",
        data: retirementProjections.map((projection) => projection.netIncome),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart options to format y-axis ticks and ensure all x-axis labels are shown
  const chartOptions = {
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return `$${Number(tickValue).toLocaleString()}`; // Add dollar sign to y-axis values
          },
        },
      },
      x: {
        ticks: {
          autoSkip: false, // Ensure all x-axis labels are shown
        },
      },
    },
  };

  // Function to calculate pre-retirement data
  const calculatePreRetirementData = () => {
    const data = [];
    for (let age = currentAge; age <= 65; age++) {
      const yearsUntilRetirement = age - currentAge;

      // Calculate total investment using the same logic as in retirement projections
      const totalInvestment =
        currentSavings *
          Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) +
        annualContribution *
          ((Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) - 1) /
            (expectedReturn / 100));

      const contributions = annualContribution * (yearsUntilRetirement + 1); // Contributions made until this age
      const expenses =
        annualExpenses *
        Math.pow(1 + inflationRate / 100, yearsUntilRetirement); // Adjusted for inflation

      data.push({
        age,
        totalInvestment: Math.round(totalInvestment),
        contributions: Math.round(contributions),
        expenses: Math.round(expenses),
      });
    }
    setPreRetirementData(data);
  };

  // Calculate pre-retirement data when current age or other relevant states change
  useEffect(() => {
    calculatePreRetirementData();
  }, [
    currentAge,
    currentSavings,
    annualContribution,
    expectedReturn,
    inflationRate,
    annualExpenses,
  ]);

  // Prepare data for the pre-retirement chart
  const preRetirementChartData = {
    labels: preRetirementData.map((item) => item.age.toString()),
    datasets: [
      {
        label: "Total Investment",
        data: preRetirementData.map((item) => item.totalInvestment),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Total Contribution",
        data: preRetirementData.map((item) => item.contributions),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Expenses",
        data: preRetirementData.map((item) => item.expenses),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Retirement Income Calculator</CardTitle>
        <CardDescription>
          Plan your financial future and estimate your retirement income
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-age">Current Age</Label>
          <Input
            id="current-age"
            type="number"
            min={20}
            max={80}
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-savings">Current Investment ($)</Label>
          <Input
            id="current-savings"
            type="text"
            value={formatNumberWithCommas(currentSavings)}
            onChange={(e) =>
              handleInputChange(setCurrentSavings, e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual-contribution">Annual Contribution ($) </Label>
          <p className=" text-sm text-muted-foreground">until age 65</p>
          <Input
            id="annual-contribution"
            type="text"
            value={formatNumberWithCommas(annualContribution)}
            onChange={(e) =>
              handleInputChange(setAnnualContribution, e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
          <Input
            id="expected-return"
            type="number"
            value={expectedReturn || ""}
            onChange={(e) =>
              setExpectedReturn(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social-security">
            Current Annual Social Security Benefit ($)
          </Label>
          <Input
            id="social-security"
            type="text"
            value={formatNumberWithCommas(socialSecurityBenefit)}
            onChange={(e) =>
              handleInputChange(setSocialSecurityBenefit, e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual-expenses">Current Annual Expenses ($)</Label>
          <Input
            id="annual-expenses"
            type="text"
            value={formatNumberWithCommas(annualExpenses)}
            onChange={(e) =>
              handleInputChange(setAnnualExpenses, e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inflation-rate">
            Expected Annual Inflation Rate (%)
          </Label>
          <Input
            id="inflation-rate"
            type="number"
            value={inflationRate || ""}
            onChange={(e) =>
              setInflationRate(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
      </CardContent>
      <CardFooter className="block">
        <h1 className="text-lg font-semibold">
          Annual Projections after Retirement
        </h1>
        {retirementProjections.map((projection) => (
          <div key={projection.age} className="my-4">
            <h2 className="text-lg font-semibold">Age {projection.age}</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>Total Investment:</td>
                  <td className="text-right">
                    {formatCurrency(projection.totalSavings)}
                  </td>
                </tr>
                <tr>
                  <td>Investment Income:</td>
                  <td className="text-right">
                    {formatCurrency(projection.investmentIncome)}
                  </td>
                </tr>
                <tr>
                  <td>Social Security:</td>
                  <td className="text-right">
                    {formatCurrency(projection.socialSecurity)}
                  </td>
                </tr>
                <tr>
                  <td>Total Income:</td>
                  <td className="text-right">
                    {formatCurrency(projection.totalIncome)}
                  </td>
                </tr>
                <tr>
                  <td>Expenses:</td>
                  <td className="text-right">
                    {formatCurrency(projection.expenses)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">Net Income:</td>
                  <td className="text-right font-bold">
                    {formatCurrency(projection.netIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* Existing Retirement Projections Chart */}
        <h1 className="text-lg font-semibold mt-6">Retirement Projections</h1>
        <Line data={chartData} options={chartOptions} />

        {/* New Pre-Retirement Chart */}
        <h1 className="text-lg font-semibold mt-6">Pre-Retirement</h1>
        <Line data={preRetirementChartData} options={chartOptions} />

        <div className="w-full mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Note: This calculator uses the 4% rule for estimating sustainable
            withdrawal rates from your investments. Always consult with a
            financial advisor for personalized advice.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

// Utility function to format numbers as currency using vanilla JavaScript
function formatCurrency(value: number) {
  return `$${Number(value.toFixed(0)).toLocaleString()}`;
}
