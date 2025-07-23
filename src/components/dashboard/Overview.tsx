// src/components/dashboard/Overview.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  Calendar,
  Plus,
  FileText,
  Settings,
  BarChart3,
  CheckCircle,
  Ticket,
  AlertCircle,
  Star,
  Download
} from 'lucide-react';
import { events } from '@/data/events';

interface OverviewProps {
  onCreateEvent: () => void;
}

const Overview: React.FC<OverviewProps> = ({ onCreateEvent }) => {
  // Mock data for admin dashboard
  const totalBookings = 1247;
  const totalRevenue = 86420;
  const upcomingEvents = events.length;

  return (
    <div className="min-h-[600px] space-y-8">
      {/* Stats Cards with dark mode support */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">{totalBookings}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-8 w-8 text-primary dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">{upcomingEvents}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">5 this week</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">2,847</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">423 online now</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <Plus className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={onCreateEvent}
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <BarChart3 className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">New booking confirmed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Summer Music Fest - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">Event created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tech Conference 2024 - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">Payment pending</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Art Workshop - 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">5-star review received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Comedy Night - 2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <TrendingUp className="mr-2 h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Chart</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Chart implementation needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Events */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <Star className="mr-2 h-5 w-5" />
              Top Performing Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{event.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.totalSeats - event.availableSeats} bookings
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    ${event.price}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">System Status</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
                </div>
              </div>
              <Settings className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Server Load</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">23%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Database Size</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">2.4 GB</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Backup</p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">2 hours ago</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Download className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;