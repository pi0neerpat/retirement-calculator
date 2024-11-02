"use client";

import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";

export function RetirementCalculatorComponent() {
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(20000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(3);

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
          <Slider
            id="current-age"
            min={20}
            max={80}
            step={1}
            value={[currentAge]}
            onValueChange={(value) => setCurrentAge(value[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentAge} years old</span>
          </div>
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
