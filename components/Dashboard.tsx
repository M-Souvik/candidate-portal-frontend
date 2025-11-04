// ✅ Mobile Responsive Dashboard
"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const fetchSummary = async () => {
    try {
      const res = await axios.get<StatsSummary>(`${BASE_URL}stats/summary`, {
        withCredentials: true,
      });
      if(res.status==403){
        router.push("/login")
      }
      setStats(res.data);
    } catch (error:any) {
      console.error("Error fetching summary:", error);
      if(error?.response?.status==403){
        router.push("/login")
      }
    }
  };

  const fetchStatewise = async () => {
    try {
      const res = await axios.get<StatewiseData[]>(
        `${BASE_URL}registrations/state-wise`,
        { withCredentials: true }
      );
      console.log("res", res)
      setStatewise(res.data);
    } catch (error:any) {
      console.error("Error fetching statewise data:", error);
       if(error?.response?.status==403){
        router.push("/login")
      }
    }
  };

   const handleLogout = async() => {
    try {
      const res:any =await api.get('/auth/logout');
      console.log(res);
      if (res.status === 200) {
        // window.location.href = '/login';
        router.push('/login');
      }
    } catch (error) {
      console.log(error);

      
    }
  }

  const fetchMonthly = async () => {
    try {
      const res = await axios.get<MonthlyData[]>(
        `${BASE_URL}registrations/month-wise`,
        { withCredentials: true }
      );
      console.log("res", res)
      if(res.status==403){
        router.push("/login")
      }
      setMonthly(res.data);
    } catch (error:any) {
      console.error("Error fetching monthly data:", error);
       if(error?.response?.status==403){
        router.push("/login")
      }
    }
  };

  const fetchScoreRanges = async () => {
    try {
      const res = await axios.get<ScoreRange[]>(`${BASE_URL}scores/range`, {
        withCredentials: true,
      });
      console.log("res", res)
      if(res.status==403){
        router.push("/login")
      }
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

  useEffect(() => {
    api
      .get("/auth/check")
      .then((res) => {
        console.log("res", res)
        if (!res.data&&!res.data.username) {
          router.push("/login");
        }
      })
      .catch(() => {});
  }, [router]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 animate-pulse">
        <div className="flex justify-between items-center bg-white rounded-xl px-2 py-1">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="h-64 flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </Card>
          <Card className="h-64 flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </Card>
        </div>

        <Card className="w-full h-[350px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-md" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-row justify-between items-start sm:items-center bg-white rounded-xl px-3 py-2 gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome back, <span className="text-blue-600">Student!</span>
          </h1>
          <p className="text-sm text-gray-500">Here’s what's happening today.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer rounded-full hover:bg-gray-100 p-1 transition">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2"><User className="w-4 h-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600"><LogOut className="w-4 h-4" /> Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{label:"Total Applicants",value:stats.registered},{label:"Enrolled Students",value:stats.enrolled},{label:"Average Score",value:stats.avg},{label:"Active Programs",value:stats.subjects}].map((item,i)=>(
          <Card key={i}>
            <CardContent className="p-5 text-center">
              <h2 className="text-3xl font-bold text-blue-600">{item.value}</h2>
              <p className="text-gray-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Applications by Geography</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statewise} layout="vertical" margin={{ top: 10, right: 20, left: 20 }}>
                <XAxis type="number" dataKey="total" />
                <YAxis type="category" dataKey="state" width={90} interval={0} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#155dfc" barSize={25} radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="total" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Month-wise Registrations</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#155dfc" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Student Score Distribution</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={scoreRange}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />
            <XAxis dataKey="score_range" />
            <Tooltip />
            <Bar dataKey="student_count" fill="#155dfc" radius={[8,8,0,0]}>
              <LabelList dataKey="student_count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
