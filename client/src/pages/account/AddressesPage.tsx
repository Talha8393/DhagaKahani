import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import type { Address } from '../../types';

const emptyAddress: Omit<Address, 'id'> = {
  label: 'Home',
  fullName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  phone: '',
  isDefault: false,
};

export default function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const addToast = useToastStore((s) => s.addToast);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await userService.getAddresses();
      setAddresses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  const openAdd = () => {
    setForm({ ...emptyAddress, fullName: user ? `${user.firstName} ${user.lastName}` : '', phone: user?.phone || '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setForm(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await userService.updateAddress(editingId, form);
        addToast('Address updated');
      } else {
        await userService.addAddress(form);
        addToast('Address added');
      }
      await loadAddresses();
      if (user) updateUser({ ...user, addresses: await userService.getAddresses() });
      setShowForm(false);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteAddress(id);
      setAddresses((a) => a.filter((x) => x.id !== id));
      addToast('Address deleted');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
        {!showForm && (
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-gray-900">{editingId ? 'Edit Address' : 'New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Label" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Home, Work..." />
            <Input label="Full Name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <Input label="Street" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            <Input label="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ZIP" value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))} required />
            <Input label="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} required />
          </div>
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="rounded border-gray-300 text-brand-600" />
            Set as default address
          </label>
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No saved addresses yet.</p>
          <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Address</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                  <address className="text-sm text-gray-600 not-italic">
                    {addr.fullName}<br />
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zipCode}<br />
                    {addr.country} · {addr.phone}
                  </address>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(addr)} className="p-2 text-gray-400 hover:text-brand-600" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
