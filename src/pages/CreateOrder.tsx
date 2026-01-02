import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/data/mockData';
import { PLATFORMS, Customer, Platform, OrderStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Link2,
  Copy,
  Check,
  Loader2,
  UserPlus,
  Users,
  ExternalLink,
} from 'lucide-react';

export default function CreateOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const preselectedCustomer = location.state?.customer as Customer | undefined;

  // Customer selection
  const [customerTab, setCustomerTab] = useState<'existing' | 'new'>(
    preselectedCustomer ? 'existing' : 'existing'
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomer?.id || ''
  );
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
  });

  // Order details
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get assigned customers for agent (mock: agent-1)
  const assignedCustomers = mockCustomers.filter(
    c => c.assignedAgentId === 'agent-1'
  );

  const generateAffiliateLink = async () => {
    if (!platform || !productUrl) {
      toast({
        title: 'Missing Information',
        description: 'Please select a platform and enter a product URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock affiliate link
    const platformCode = platform.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const randomId = Math.random().toString(36).substring(2, 8);
    const generatedLink = `https://aff.link/${platformCode}/${randomId}`;

    setAffiliateLink(generatedLink);
    setIsGenerating(false);

    toast({
      title: 'Link Generated',
      description: 'Your affiliate link has been created.',
    });
  };

  const copyToClipboard = async () => {
    if (!affiliateLink) return;

    await navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: 'Copied!',
      description: 'Affiliate link copied to clipboard.',
    });
  };

  const handleSaveOrder = async () => {
    // Validation
    const hasCustomer =
      customerTab === 'existing'
        ? !!selectedCustomerId
        : newCustomer.name && newCustomer.phone;

    if (!hasCustomer) {
      toast({
        title: 'Validation Error',
        description: 'Please select or add a customer.',
        variant: 'destructive',
      });
      return;
    }

    if (!platform || !productName || !productUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all order details.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);

    toast({
      title: 'Order Created',
      description: 'The order has been saved successfully.',
    });

    navigate('/customers');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'confirmed':
        return <Badge variant="warning">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="muted">Pending</Badge>;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Create Order"
        description="Create a new affiliate order for a customer"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={customerTab}
              onValueChange={v => setCustomerTab(v as 'existing' | 'new')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Customer</TabsTrigger>
                <TabsTrigger value="new">New Customer</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Select Customer</Label>
                  <Select
                    value={selectedCustomerId}
                    onValueChange={setSelectedCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedCustomers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center gap-2">
                            <span>{customer.name}</span>
                            <span className="text-muted-foreground">
                              • {customer.phone}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomerId && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    {(() => {
                      const customer = assignedCustomers.find(
                        c => c.id === selectedCustomerId
                      );
                      return customer ? (
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="new" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="John Doe"
                    value={newCustomer.name}
                    onChange={e =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input
                    id="customer-phone"
                    placeholder="+1 (555) 000-0000"
                    value={newCustomer.phone}
                    onChange={e =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={platform}
                onValueChange={v => setPlatform(v as Platform)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                placeholder="Wireless Bluetooth Headphones"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-url">Product URL</Label>
              <div className="flex gap-2">
                <Input
                  id="product-url"
                  placeholder="https://amazon.com/product/..."
                  value={productUrl}
                  onChange={e => setProductUrl(e.target.value)}
                  className="flex-1"
                />
                {productUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(productUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select
                value={orderStatus}
                onValueChange={v => setOrderStatus(v as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Link Generation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Affiliate Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={generateAffiliateLink}
                disabled={!platform || !productUrl || isGenerating}
                className="sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Generate Affiliate Link
                  </>
                )}
              </Button>
            </div>

            {affiliateLink && (
              <div className="animate-slide-in rounded-lg border border-success/20 bg-success/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Generated Link
                    </p>
                    <p className="truncate text-sm text-primary font-mono">
                      {affiliateLink}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => navigate('/customers')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveOrder} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Order'
          )}
        </Button>
      </div>
    </div>
  );
}
