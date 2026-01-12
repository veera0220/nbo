import { useState } from 'react';
import { useNBO } from '../../context/NBOContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

export function StackingMaster() {
  const { formFactors, dataRates, stackings, addStacking, updateStacking, deleteStacking } = useNBO();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    formFactorId: '',
    dataRateId: '',
  });

  const availableDataRates = formData.formFactorId
    ? dataRates.filter(dr => dr.formFactorId === formData.formFactorId)
    : [];

  const handleOpenDialog = (id?: string) => {
    if (id) {
      const st = stackings.find(s => s.id === id);
      if (st) {
        setFormData({ 
          name: st.name, 
          formFactorId: st.formFactorId,
          dataRateId: st.dataRateId 
        });
        setEditingId(id);
      }
    } else {
      setFormData({ name: '', formFactorId: '', dataRateId: '' });
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.formFactorId || !formData.dataRateId) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingId) {
      updateStacking(editingId, formData);
      toast.success('Stacking updated successfully');
    } else {
      addStacking(formData);
      toast.success('Stacking added successfully');
    }

    setDialogOpen(false);
    setFormData({ name: '', formFactorId: '', dataRateId: '' });
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteStacking(deletingId);
      toast.success('Stacking deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const getFormFactorName = (id: string) => {
    return formFactors.find(ff => ff.id === id)?.name || 'Unknown';
  };

  const getDataRateName = (id: string) => {
    return dataRates.find(dr => dr.id === id)?.name || 'Unknown';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Stacking Master</h1>
          <p className="text-gray-600">Manage valid stacking options for form factor + data rate combinations</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Stacking
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stacking</TableHead>
              <TableHead>Form Factor</TableHead>
              <TableHead>Data Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stackings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No stackings defined
                </TableCell>
              </TableRow>
            ) : (
              stackings.map((st) => (
                <TableRow key={st.id}>
                  <TableCell>{st.name}</TableCell>
                  <TableCell>{getFormFactorName(st.formFactorId)}</TableCell>
                  <TableCell>{getDataRateName(st.dataRateId)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(st.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(st.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Stacking</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update' : 'Create a new'} stacking configuration for a form factor + data rate combination
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formFactorId">Form Factor</Label>
              <Select
                value={formData.formFactorId}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  formFactorId: value,
                  dataRateId: '' // Reset data rate when form factor changes
                })}
              >
                <SelectTrigger id="formFactorId">
                  <SelectValue placeholder="Select form factor" />
                </SelectTrigger>
                <SelectContent>
                  {formFactors.map(ff => (
                    <SelectItem key={ff.id} value={ff.id}>{ff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataRateId">Data Rate</Label>
              <Select
                value={formData.dataRateId}
                onValueChange={(value) => setFormData({ ...formData, dataRateId: value })}
                disabled={!formData.formFactorId}
              >
                <SelectTrigger id="dataRateId">
                  <SelectValue placeholder="Select data rate" />
                </SelectTrigger>
                <SelectContent>
                  {availableDataRates.map(dr => (
                    <SelectItem key={dr.id} value={dr.id}>{dr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Stacking</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 1x, 2x, 4x"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stacking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
