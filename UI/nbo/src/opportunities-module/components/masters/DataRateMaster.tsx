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

export function DataRateMaster() {
  const { formFactors, dataRates, addDataRate, updateDataRate, deleteDataRate } = useNBO();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    formFactorId: '',
  });

  const handleOpenDialog = (id?: string) => {
    if (id) {
      const dr = dataRates.find(d => d.id === id);
      if (dr) {
        setFormData({ name: dr.name, formFactorId: dr.formFactorId });
        setEditingId(id);
      }
    } else {
      setFormData({ name: '', formFactorId: '' });
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.formFactorId) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingId) {
      updateDataRate(editingId, formData);
      toast.success('Data Rate updated successfully');
    } else {
      addDataRate(formData);
      toast.success('Data Rate added successfully');
    }

    setDialogOpen(false);
    setFormData({ name: '', formFactorId: '' });
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteDataRate(deletingId);
      toast.success('Data Rate deleted successfully');
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Data Rate Master</h1>
          <p className="text-gray-600">Manage data rates for each form factor</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Data Rate
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Rate</TableHead>
              <TableHead>Form Factor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No data rates defined
                </TableCell>
              </TableRow>
            ) : (
              dataRates.map((dr) => (
                <TableRow key={dr.id}>
                  <TableCell>{dr.name}</TableCell>
                  <TableCell>{getFormFactorName(dr.formFactorId)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(dr.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(dr.id)}
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
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Data Rate</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update' : 'Create a new'} data rate and associate with a form factor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formFactorId">Form Factor</Label>
              <Select
                value={formData.formFactorId}
                onValueChange={(value) => setFormData({ ...formData, formFactorId: value })}
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
              <Label htmlFor="name">Data Rate</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 400G"
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
            <AlertDialogTitle>Delete Data Rate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will also delete all associated stackings. This action cannot be undone.
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
