"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, PiggyBank, CreditCard, TrendingUp, Shield, DollarSign } from "lucide-react"

// EMI Calculator Component
function EMICalculator() {
  const [principal, setPrincipal] = useState("")
  const [rate, setRate] = useState("")
  const [tenure, setTenure] = useState("")
  const [result, setResult] = useState<{ emi: number; totalAmount: number; totalInterest: number } | null>(null)

  const calculateEMI = () => {
    const p = Number.parseFloat(principal)
    const r = Number.parseFloat(rate) / 12 / 100
    const n = Number.parseFloat(tenure) * 12

    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalAmount = emi * n
      const totalInterest = totalAmount - p

      setResult({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
      })
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          EMI Calculator
        </CardTitle>
        <CardDescription>Calculate your monthly loan payments (EMI) for home, car, or personal loans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Loan Amount ($)</Label>
            <Input
              id="principal"
              type="number"
              placeholder="100000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Interest Rate (% per year)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              placeholder="7.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenure">Loan Tenure (years)</Label>
            <Input
              id="tenure"
              type="number"
              placeholder="20"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateEMI} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Calculate EMI
        </Button>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${result.emi.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly EMI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">${result.totalAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">${result.totalInterest.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Interest</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Savings Calculator Component
function SavingsCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState("")
  const [annualRate, setAnnualRate] = useState("")
  const [years, setYears] = useState("")
  const [result, setResult] = useState<{
    futureValue: number
    totalContributions: number
    totalInterest: number
  } | null>(null)

  const calculateSavings = () => {
    const pmt = Number.parseFloat(monthlyAmount)
    const r = Number.parseFloat(annualRate) / 12 / 100
    const n = Number.parseFloat(years) * 12

    if (pmt && r && n) {
      const futureValue = pmt * (((1 + r) ** n - 1) / r)
      const totalContributions = pmt * n
      const totalInterest = futureValue - totalContributions

      setResult({
        futureValue: Math.round(futureValue),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(totalInterest),
      })
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          Savings Calculator
        </CardTitle>
        <CardDescription>Calculate how your monthly savings will grow with compound interest over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-amount">Monthly Savings ($)</Label>
            <Input
              id="monthly-amount"
              type="number"
              placeholder="500"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="annual-rate">Annual Interest Rate (%)</Label>
            <Input
              id="annual-rate"
              type="number"
              step="0.1"
              placeholder="5.0"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Time Period (years)</Label>
            <Input id="years" type="number" placeholder="10" value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
        </div>

        <Button onClick={calculateSavings} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Calculate Savings
        </Button>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${result.futureValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Future Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">${result.totalContributions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">${result.totalInterest.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Interest Earned</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Budget Calculator Component
function BudgetCalculator() {
  const [income, setIncome] = useState("")
  const [housing, setHousing] = useState("")
  const [transportation, setTransportation] = useState("")
  const [food, setFood] = useState("")
  const [utilities, setUtilities] = useState("")
  const [entertainment, setEntertainment] = useState("")
  const [other, setOther] = useState("")

  const totalExpenses = [housing, transportation, food, utilities, entertainment, other].reduce(
    (sum, expense) => sum + (Number.parseFloat(expense) || 0),
    0,
  )

  const remainingBudget = (Number.parseFloat(income) || 0) - totalExpenses
  const budgetStatus = remainingBudget >= 0 ? "surplus" : "deficit"

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Budget Calculator
        </CardTitle>
        <CardDescription>Track your monthly income and expenses to maintain a healthy budget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="income">Monthly Income ($)</Label>
          <Input
            id="income"
            type="number"
            placeholder="5000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="housing">Housing ($)</Label>
            <Input
              id="housing"
              type="number"
              placeholder="1500"
              value={housing}
              onChange={(e) => setHousing(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportation">Transportation ($)</Label>
            <Input
              id="transportation"
              type="number"
              placeholder="400"
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="food">Food ($)</Label>
            <Input id="food" type="number" placeholder="600" value={food} onChange={(e) => setFood(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="utilities">Utilities ($)</Label>
            <Input
              id="utilities"
              type="number"
              placeholder="200"
              value={utilities}
              onChange={(e) => setUtilities(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entertainment">Entertainment ($)</Label>
            <Input
              id="entertainment"
              type="number"
              placeholder="300"
              value={entertainment}
              onChange={(e) => setEntertainment(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="other">Other Expenses ($)</Label>
            <Input
              id="other"
              type="number"
              placeholder="200"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                ${(Number.parseFloat(income) || 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">${totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${budgetStatus === "surplus" ? "text-green-600" : "text-red-600"}`}>
                ${Math.abs(remainingBudget).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {budgetStatus === "surplus" ? "Budget Surplus" : "Budget Deficit"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Emergency Fund Calculator Component
function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("")
  const [currentSavings, setCurrentSavings] = useState("")
  const [targetMonths, setTargetMonths] = useState("6")

  const targetAmount = (Number.parseFloat(monthlyExpenses) || 0) * (Number.parseFloat(targetMonths) || 6)
  const shortfall = Math.max(0, targetAmount - (Number.parseFloat(currentSavings) || 0))
  const progressPercentage =
    targetAmount > 0 ? Math.min(100, ((Number.parseFloat(currentSavings) || 0) / targetAmount) * 100) : 0

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Emergency Fund Calculator
        </CardTitle>
        <CardDescription>Calculate how much you need in your emergency fund for financial security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-expenses">Monthly Expenses ($)</Label>
            <Input
              id="monthly-expenses"
              type="number"
              placeholder="3000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-savings">Current Emergency Savings ($)</Label>
            <Input
              id="current-savings"
              type="number"
              placeholder="5000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-months">Target Months Coverage</Label>
            <Select value={targetMonths} onValueChange={setTargetMonths}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="9">9 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-primary">${targetAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Target Emergency Fund</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                ${(Number.parseFloat(currentSavings) || 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Current Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">${shortfall.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Amount Needed</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Investment Return Calculator Component
function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState("")
  const [monthlyContribution, setMonthlyContribution] = useState("")
  const [expectedReturn, setExpectedReturn] = useState("")
  const [investmentYears, setInvestmentYears] = useState("")
  const [result, setResult] = useState<{ futureValue: number; totalContributions: number; totalGains: number } | null>(
    null,
  )

  const calculateInvestment = () => {
    const initial = Number.parseFloat(initialAmount) || 0
    const monthly = Number.parseFloat(monthlyContribution) || 0
    const rate = Number.parseFloat(expectedReturn) / 100 / 12
    const periods = Number.parseFloat(investmentYears) * 12

    if (rate && periods) {
      const futureValueInitial = initial * Math.pow(1 + rate, periods)
      const futureValueAnnuity = monthly * (((1 + rate) ** periods - 1) / rate)
      const futureValue = futureValueInitial + futureValueAnnuity
      const totalContributions = initial + monthly * periods
      const totalGains = futureValue - totalContributions

      setResult({
        futureValue: Math.round(futureValue),
        totalContributions: Math.round(totalContributions),
        totalGains: Math.round(totalGains),
      })
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Investment Return Calculator
        </CardTitle>
        <CardDescription>Calculate potential returns on your investments with compound growth</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initial-amount">Initial Investment ($)</Label>
            <Input
              id="initial-amount"
              type="number"
              placeholder="10000"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
            <Input
              id="monthly-contribution"
              type="number"
              placeholder="500"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              step="0.1"
              placeholder="7.0"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="investment-years">Investment Period (years)</Label>
            <Input
              id="investment-years"
              type="number"
              placeholder="20"
              value={investmentYears}
              onChange={(e) => setInvestmentYears(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateInvestment} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Calculate Returns
        </Button>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${result.futureValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Future Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">${result.totalContributions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Invested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${result.totalGains.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Investment Gains</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
            Financial <span className="text-primary">Tools</span> & Calculators
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Make informed financial decisions with our comprehensive suite of calculators and planning tools. All
            calculations are performed instantly and your data stays private.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EMICalculator />
            <SavingsCalculator />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BudgetCalculator />
            <EmergencyFundCalculator />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InvestmentCalculator />

            {/* Additional Tools Coming Soon */}
            <Card className="border-border border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  More Tools Coming Soon
                </CardTitle>
                <CardDescription>
                  We're constantly adding new financial tools to help you make better money decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Retirement Planning Calculator
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    Tax Planning Tools
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Debt Consolidation Calculator
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    College Savings Planner
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-16 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-bold text-balance mb-4 text-card-foreground">Important Disclaimer</h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            These calculators are designed for educational purposes and provide estimates based on the information you
            provide. Actual results may vary depending on various factors including market conditions, fees, taxes, and
            changes in personal circumstances. For personalized financial advice, please consult with a qualified
            financial advisor.
          </p>
        </div>
      </div>
    </div>
  )
}
