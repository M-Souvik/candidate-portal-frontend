"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

// --- Interfaces ---
interface StatsSummary {
  registered: number;
  enrolled: number;
  avg: number;
  subjects: number;
}

interface ScoreRange {
  score_range: string;
  student_count: number;
}

interface StatewiseData {
  state: string;
  total: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsSummary>({
    registered: 0,
    enrolled: 0,
    avg: 0,
    subjects: 0,
  });
  const [statewise, setStatewise] = useState<StatewiseData[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [scoreRange, setScoreRange] = useState<ScoreRange[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // --- Fetch functions ---
  const fetchSummary = async () => {
    try {
      const res = await axios.get<StatsSummary>(`${BASE_URL}stats/summary`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const fetchStatewise = async () => {
    try {
      const res = await axios.get<StatewiseData[]>(`${BASE_URL}registrations/state-wise`, {
        withCredentials: true,
      });
      setStatewise(res.data);
    } catch (error) {
      console.error("Error fetching statewise data:", error);
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await axios.get<MonthlyData[]>(`${BASE_URL}registrations/month-wise`, {
        withCredentials: true,
      });
      setMonthly(res.data);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const fetchScoreRanges = async () => {
    try {
      const res = await axios.get<ScoreRange[]>(`${BASE_URL}scores/range`, {
        withCredentials: true,
      });
      setScoreRange(res.data);
    } catch (err) {
      console.error("Error fetching score range stats:", err);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSummary(),
        fetchStatewise(),
        fetchMonthly(),
        fetchScoreRanges(),
      ]);
      setLoading(false);
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6 text-lg font-medium">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🌟 Header Section */}
      <div className="flex justify-between items-center bg-white rounded-xl  px-2 py-1">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, <span className="text-blue-600">Student !</span>
          </h1>
          <p className="text-sm text-gray-500">Here’s what’s happening today.</p>
        </div>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer rounded-full hover:bg-gray-100 p-1 transition">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {/* <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-gray-800">Admin</span>
                <span className="text-xs text-gray-500">admin@dexit.com</span>
              </div> */}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-3xl font-bold text-blue-600">{stats.registered}</h2>
            <p className="text-gray-500">Total Applicants</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-3xl font-bold text-blue-600">{stats.enrolled}</h2>
            <p className="text-gray-500">Enrolled Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-3xl font-bold text-blue-600">{stats.avg || 0}</h2>
            <p className="text-gray-500">Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <h2 className="text-3xl font-bold text-blue-600">{stats.subjects}</h2>
            <p className="text-gray-500">Active Programs</p>
          </CardContent>
        </Card>
      </div>

      {/* 📈 Charts Section */}
      <div className="grid grid-cols-4 gap-6">
        {/* Statewise Bar Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Applications by Geography</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statewise}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <XAxis type="number" dataKey="total" domain={[0, "dataMax + 1"]} />
                <YAxis type="category" dataKey="state" width={100} />
                <Tooltip />
                <Bar dataKey="total" fill="#155dfc" barSize={25} radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="total" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Line Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Month-wise Registrations</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#155dfc"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 🎯 Score Range Chart */}
      <Card className="col-span-4 w-full rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Student Score Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={scoreRange} margin={{ left: 40, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />
            <XAxis dataKey="score_range" />
            <Tooltip />
            <Bar dataKey="student_count" fill="#155dfc" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="student_count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
