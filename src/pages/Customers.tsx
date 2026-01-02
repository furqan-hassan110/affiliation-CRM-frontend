import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCustomers, mockAgents } from '@/data/mockData';
import { Customer } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, UserCircle } from 'lucide-react';

export default function Customers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter customers based on role and filters
  const filteredCustomers = customers.filter(customer => {
    // Agent can only see assigned customers (mock: agent-1)
    if (!isAdmin && customer.assignedAgentId !== 'agent-1') {
      return false;
    }

    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssignAgent = (customerId: string, agentId: string) => {
    const agent = mockAgents.find(a => a.id === agentId);
    setCustomers(
      customers.map(c =>
        c.id === customerId
          ? {
              ...c,
              assignedAgentId: agentId || null,
              assignedAgentName: agent?.name,
            }
          : c
      )
    );
    toast({
      title: 'Agent Assigned',
      description: agent
        ? `Customer assigned to ${agent.name}`
        : 'Customer unassigned',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'inactive':
        return <Badge variant="muted">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const adminColumns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-foreground">{customer.name}</p>
            {customer.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer: Customer) => (
        <span className="text-muted-foreground">{customer.phone}</span>
      ),
    },
    {
      key: 'assignedAgent',
      header: 'Assigned Agent',
      render: (customer: Customer) => (
        <Select
          value={customer.assignedAgentId || 'unassigned'}
          onValueChange={value =>
            handleAssignAgent(
              customer.id,
              value === 'unassigned' ? '' : value
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">
              <span className="text-muted-foreground">Unassigned</span>
            </SelectItem>
            {mockAgents
              .filter(a => a.status === 'active')
              .map(agent => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (customer: Customer) => getStatusBadge(customer.status),
    },
  ];

  const agentColumns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-foreground">{customer.name}</p>
            {customer.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer: Customer) => (
        <span className="text-muted-foreground">{customer.phone}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (customer: Customer) => getStatusBadge(customer.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (customer: Customer) => (
        <Button
          size="sm"
          onClick={() =>
            navigate('/create-order', { state: { customer } })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Customers"
        description={
          isAdmin
            ? 'View and manage all customers across your network'
            : 'View your assigned customers and create orders'
        }
      />

      {/* Stats for agents */}
      {!isAdmin && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {filteredCustomers.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Assigned Customers
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={isAdmin ? adminColumns : agentColumns}
        data={filteredCustomers}
        emptyMessage={
          isAdmin
            ? 'No customers found'
            : 'No assigned customers found'
        }
      />
    </div>
  );
}
