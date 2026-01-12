import { useState } from 'react';
import { useNBO } from '../../context/NBOContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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

export function FormFactorMaster() {
  const { formFactors, addFormFactor, updateFormFactor, deleteFormFactor } = useNBO();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    productManager: '',
  });

  const handleOpenDialog = (id?: string) => {
    if (id) {
      const ff = formFactors.find(f => f.id === id);
      if (ff) {
        setFormData({ name: ff.name, productManager: ff.productManager });
        setEditingId(id);
      }
    } else {
      setFormData({ name: '', productManager: '' });
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.productManager) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingId) {
      updateFormFactor(editingId, formData);
      toast.success('Form Factor updated successfully');
    } else {
      addFormFactor(formData);
      toast.success('Form Factor added successfully');
    }

    setDialogOpen(false);
    setFormData({ name: '', productManager: '' });
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteFormFactor(deletingId);
      toast.success('Form Factor deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Form Factor Master</h1>
          <p className="text-gray-600">Manage HSIO form factors and product managers</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Form Factor
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Factor</TableHead>
              <TableHead>Product Manager</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formFactors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No form factors defined
                </TableCell>
              </TableRow>
            ) : (
              formFactors.map((ff) => (
                <TableRow key={ff.id}>
                  <TableCell>{ff.name}</TableCell>
                  <TableCell>{ff.productManager}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(ff.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(ff.id)}
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
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Form Factor</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update' : 'Create a new'} form factor and assign a product manager
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Form Factor Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., QSFP-DD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productManager">Product Manager</Label>
              <Input
                id="productManager"
                value={formData.productManager}
                onChange={(e) => setFormData({ ...formData, productManager: e.target.value })}
                placeholder="e.g., John Smith"
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
            <AlertDialogTitle>Delete Form Factor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will also delete all associated data rates and stackings. This action cannot be undone.
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
