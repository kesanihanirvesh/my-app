
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useImprovedAuth } from '@/contexts/ImprovedAuthContext';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Bot,
  UserCheck,
  Zap,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalIncidents: number;
  openIncidents: number;
  resolvedToday: number;
  avgResolutionTime: number;
  aiSuccessRate: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalIncidents: 0,
    openIncidents: 0,
    resolvedToday: 0,
    avgResolutionTime: 0,
    aiSuccessRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useImprovedAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load users count
      const { data: users } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Load incidents
      const { data: incidents } = await supabase
        .from('incidents')
        .select('*');

      const today = new Date().toDateString();
      const openIncidents = incidents?.filter(i => i.status === 'Open').length || 0;
      const resolvedToday = incidents?.filter(i => 
        i.status === 'Resolved' && 
        new Date(i.created_at).toDateString() === today
      ).length || 0;

      // Calculate AI success rate (mock calculation)
      const aiSuccessRate = Math.round(85 + Math.random() * 10);
      
      setStats({
        totalUsers: users?.length || 0,
        totalIncidents: incidents?.length || 0,
        openIncidents,
        resolvedToday,
        avgResolutionTime: Math.round(15 + Math.random() * 20),
        aiSuccessRate
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Mouritech Support System Overview</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              Admin: {user?.email}
            </Badge>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Active registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">
                All time incidents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.openIncidents}</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">
                Issues closed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResolutionTime}min</div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Success Rate</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.aiSuccessRate}%</div>
              <p className="text-xs text-muted-foreground">
                Automated resolutions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/knowledge-base')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Bot className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Knowledge Base</p>
                <p className="text-sm text-gray-500">Manage articles & FAQ</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/service-catalog')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Service Catalog</p>
                <p className="text-sm text-gray-500">Define service offerings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">User Management</p>
                <p className="text-sm text-gray-500">Manage user access</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-gray-500">Performance metrics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Incident #12345 resolved automatically</p>
                  <p className="text-sm text-gray-600">AI resolved password reset issue - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-600">john.doe@company.com joined the platform - 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium">High priority incident created</p>
                  <p className="text-sm text-gray-600">Network connectivity issue reported - 8 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
