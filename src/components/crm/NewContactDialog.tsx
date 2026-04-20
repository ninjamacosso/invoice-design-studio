import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const NewContactDialog = ({ open, onOpenChange }: Props) => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Contacto criado", description: "Novo contacto guardado com sucesso." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Novo Contacto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome</Label><Input placeholder="João" required /></div>
            <div className="space-y-2"><Label>Apelido</Label><Input placeholder="Silva" required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@empresa.com" required /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input placeholder="+351 912 345 678" /></div>
            <div className="space-y-2"><Label>Empresa</Label><Input placeholder="Acme Corp." /></div>
            <div className="space-y-2"><Label>Cargo</Label><Input placeholder="Director Comercial" /></div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select defaultValue="Lead">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select defaultValue="João Martins">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="João Martins">João Martins</SelectItem>
                  <SelectItem value="Ana Ferreira">Ana Ferreira</SelectItem>
                  <SelectItem value="Carlos Mendes">Carlos Mendes</SelectItem>
                  <SelectItem value="Luísa Costa">Luísa Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Notas</Label><Textarea placeholder="Detalhes adicionais sobre o contacto..." rows={3} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="gradient-primary text-white">Guardar Contacto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
