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
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(20000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(3); // New state for inflation rate

  const calculateRetirementIncome = (age: number) => {
    const yearsUntilRetirement = Math.max(0, age - currentAge);
    
    // Adjust expenses and social security for inflation
    const adjustedAnnualExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
    const adjustedSocialSecurityBenefit = socialSecurityBenefit * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    const totalSavings =
      currentSavings *
        Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) +
      annualContribution *
        ((Math.pow(1 + expectedReturn / 100, yearsUntilRetirement) - 1) /
          (expectedReturn / 100));
    
    const annualInvestmentIncome = totalSavings * 0.04; // Using the 4% rule
    const totalAnnualIncome = annualInvestmentIncome + adjustedSocialSecurityBenefit; // Total income includes adjusted Social Security
    const netIncome = totalAnnualIncome - adjustedAnnualExpenses; // Net income after adjusted expenses

    return {
      investmentIncome: Math.round(annualInvestmentIncome),
      socialSecurity: adjustedSocialSecurityBenefit,
      totalIncome: Math.round(totalAnnualIncome),
      expenses: adjustedAnnualExpenses,
      netIncome: Math.round(netIncome),
    };
  };

  const incomeAt65 = calculateRetirementIncome(65);
  const incomeAt75 = calculateRetirementIncome(75);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Retirement Income Calculator</CardTitle>
        <CardDescription>
          Plan your financial future and estimate your retirement income
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="w-full mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">How to Use This Calculator:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter your current details.</li>
            <li>
              Estimate your expected annual investment return, annual Social
              Security benefit, and annual expenses.
            </li>
            <li>
              Your projected income will be displayed for both 65 and 75 years
              old.
            </li>
          </ol>
          <p className="mt-2 text-sm text-muted-foreground">
            Note: This calculator uses the 4% rule for estimating sustainable
            withdrawal rates from your investments. Always consult with a
            financial advisor for personalized advice.
          </p>
        </div>
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
          <Label htmlFor="retirement-age">Retirement Age</Label>
          <Slider
            id="retirement-age"
            min={50}
            max={80}
            step={1}
            value={[retirementAge]}
            onValueChange={(value) => setRetirementAge(value[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{retirementAge} years old</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-savings">Current Savings ($)</Label>
          <Input
            id="current-savings"
            type="number"
            value={currentSavings || ""}
            onChange={(e) =>
              setCurrentSavings(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual-contribution">Annual Contribution ($)</Label>
          <Input
            id="annual-contribution"
            type="number"
            value={annualContribution || ""}
            onChange={(e) =>
              setAnnualContribution(e.target.value ? Number(e.target.value) : 0)
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
            Expected Annual Social Security Benefit ($)
          </Label>
          <Input
            id="social-security"
            type="number"
            value={socialSecurityBenefit || ""}
            onChange={(e) =>
              setSocialSecurityBenefit(
                e.target.value ? Number(e.target.value) : 0
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual-expenses">
            Expected Annual Expenses in Retirement ($)
          </Label>
          <Input
            id="annual-expenses"
            type="number"
            value={annualExpenses || ""}
            onChange={(e) =>
              setAnnualExpenses(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inflation-rate">Expected Annual Inflation Rate (%)</Label>
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
      <CardFooter className="flex-col space-y-4">
        <div className="w-full space-y-2">
          <h3 className="text-lg font-semibold">
            Projected Annual Income at Age 65
          </h3>
          <div className="flex justify-between">
            <span>Investment Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt65.investmentIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Social Security:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt65.socialSecurity)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt65.totalIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expenses:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt65.expenses)}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt65.netIncome)}
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <h3 className="text-lg font-semibold">
            Projected Annual Income at Age 75
          </h3>
          <div className="flex justify-between">
            <span>Investment Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt75.investmentIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Social Security:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt75.socialSecurity)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt75.totalIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expenses:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt75.expenses)}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net Income:</span>
            <span className="text-right flex-1">
              {formatCurrency(incomeAt75.netIncome)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// Utility function to format numbers as currency using vanilla JavaScript
function formatCurrency(value: number) {
  return `$${Number(value).toLocaleString()}`;
}
