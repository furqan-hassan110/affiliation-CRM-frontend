import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAgents, mockCustomers } from '@/data/mockData';
import { Agent } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Pencil,
  Power,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAgent = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required.',
        variant: 'destructive',
      });
      return;
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: 'active',
      assignedCustomers: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAgents([...agents, newAgent]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', email: '', phone: '' });
    toast({
      title: 'Agent Added',
      description: `${newAgent.name} has been added successfully.`,
    });
  };

  const handleEditAgent = () => {
    if (!selectedAgent || !formData.name || !formData.email) return;

    setAgents(
      agents.map(a =>
        a.id === selectedAgent.id
          ? { ...a, name: formData.name, email: formData.email, phone: formData.phone }
          : a
      )
    );
    setIsEditDialogOpen(false);
    setSelectedAgent(null);
    setFormData({ name: '', email: '', phone: '' });
    toast({
      title: 'Agent Updated',
      description: 'Agent information has been updated.',
    });
  };

  const handleToggleStatus = () => {
    if (!selectedAgent) return;

    const newStatus = selectedAgent.status === 'active' ? 'inactive' : 'active';
    setAgents(
      agents.map(a =>
        a.id === selectedAgent.id ? { ...a, status: newStatus } : a
      )
    );
    setIsConfirmDialogOpen(false);
    setSelectedAgent(null);
    toast({
      title: `Agent ${newStatus === 'active' ? 'Enabled' : 'Disabled'}`,
      description: `The agent is now ${newStatus}.`,
    });
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
    });
    setIsEditDialogOpen(true);
  };

  const openToggleDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConfirmDialogOpen(true);
  };

  const openAssignDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAssignDialogOpen(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Agent',
      render: (agent: Agent) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
            {agent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-foreground">{agent.name}</p>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (agent: Agent) => (
        <span className="text-muted-foreground">{agent.phone}</span>
      ),
    },
    {
      key: 'assignedCustomers',
      header: 'Customers',
      render: (agent: Agent) => (
        <span className="font-medium">{agent.assignedCustomers}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (agent: Agent) => (
        <Badge variant={agent.status === 'active' ? 'success' : 'muted'}>
          {agent.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (agent: Agent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(agent)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openAssignDialog(agent)}>
              <Users className="mr-2 h-4 w-4" />
              Assign Customers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openToggleDialog(agent)}>
              <Power className="mr-2 h-4 w-4" />
              {agent.status === 'active' ? 'Disable' : 'Enable'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Agents Management"
        description="Manage your affiliate agents and their assignments"
        action={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
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
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAgents}
        emptyMessage="No agents found"
      />

      {/* Add Agent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Create a new affiliate agent account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAgent}>Add Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAgent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Customers Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Customers to {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Select customers to assign to this agent.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {mockCustomers.map(customer => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                  <Badge
                    variant={
                      customer.assignedAgentId === selectedAgent?.id
                        ? 'success'
                        : 'outline'
                    }
                  >
                    {customer.assignedAgentId === selectedAgent?.id
                      ? 'Assigned'
                      : 'Unassigned'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsAssignDialogOpen(false);
                toast({
                  title: 'Assignments Updated',
                  description: 'Customer assignments have been saved.',
                });
              }}
            >
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Toggle Status Dialog */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title={`${selectedAgent?.status === 'active' ? 'Disable' : 'Enable'} Agent`}
        description={`Are you sure you want to ${
          selectedAgent?.status === 'active' ? 'disable' : 'enable'
        } ${selectedAgent?.name}? ${
          selectedAgent?.status === 'active'
            ? 'They will no longer be able to access the system.'
            : 'They will regain access to the system.'
        }`}
        confirmLabel={selectedAgent?.status === 'active' ? 'Disable' : 'Enable'}
        variant={selectedAgent?.status === 'active' ? 'destructive' : 'default'}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
