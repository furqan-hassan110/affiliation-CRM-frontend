import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { mockAgents, mockCustomers, mockOrders } from '@/data/mockData';
import {
  Users,
  UserCircle,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Calculate stats
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(a => a.status === 'active').length;
  const totalCustomers = mockCustomers.length;
  const totalOrders = mockOrders.length;

  // Agent-specific stats
  const agentCustomers = mockCustomers.filter(
    c => c.assignedAgentId === 'agent-1' // Mock: Sarah Agent
  );
  const agentOrders = mockOrders.filter(o => o.agentId === 'agent-1');

  const recentOrders = mockOrders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'confirmed':
        return <Badge variant="warning">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="muted">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0]}!`}
        description={
          isAdmin
            ? 'Here\'s an overview of your affiliate network'
            : 'Here\'s a summary of your assigned work'
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Agents"
              value={totalAgents}
              subtitle={`${activeAgents} active`}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Customers"
              value={totalCustomers}
              subtitle="Across all agents"
              icon={UserCircle}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Total Orders"
              value={totalOrders}
              subtitle="This month"
              icon={ShoppingCart}
              trend={{ value: 15, isPositive: true }}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Assigned Customers"
              value={agentCustomers.length}
              subtitle="Active assignments"
              icon={UserCircle}
            />
            <StatCard
              title="Orders Created"
              value={agentOrders.length}
              subtitle="This month"
              icon={ShoppingCart}
            />
            <StatCard
              title="Completion Rate"
              value="87%"
              subtitle="Orders completed"
              icon={TrendingUp}
              trend={{ value: 5, isPositive: true }}
            />
          </>
        )}
      </div>

      {/* Additional sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {order.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} • {order.platform}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-success/10 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-foreground">Completed Orders</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-success">
                {mockOrders.filter(o => o.status === 'completed').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-warning/10 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium text-foreground">Pending Orders</p>
                  <p className="text-sm text-muted-foreground">Awaiting action</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-warning">
                {mockOrders.filter(o => o.status === 'pending').length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Active Customers</p>
                  <p className="text-sm text-muted-foreground">Engaged this month</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">
                {mockCustomers.filter(c => c.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
