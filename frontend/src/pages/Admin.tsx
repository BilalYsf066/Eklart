import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
//import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Users, Package, UserCheck, Eye, Check, X, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router";
import type { Application } from "@/services/adminAuthService";
import { api } from "@/lib/api";

export default function UpdatedAdminPanel() {
  const navigate = useNavigate();
  const {
    admin,
    users,
    applications,
    logout,
    loadUsers,
    loadApplications,
    approveApplication,
    rejectApplication,
  } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // Charger les données au montage du composant
    loadUsers();
    loadApplications();
  }, [loadUsers, loadApplications]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Le nom de la catégorie ne peut pas être vide.");
      return;
    }

    try {
      const response = await api.post("/admin/categories", {
        name: categoryName,
      });

      if (response.status === 201) {
        toast.success("Catégorie ajoutée avec succès!");
        setIsAddCategoryOpen(false);
        setCategoryName("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast.error("Erreur lors de l'ajout de la catégorie.");
    }
  };

  const handleApproveApplication = async (applicationId: number) => {
    setLoading(true);
    try {
      await approveApplication(applicationId);
      toast.success("Candidature approuvée", {
        description: "L'artisan a été approuvé et notifié.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'approbation';
      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: number) => {
    setLoading(true);
    try {
      await rejectApplication(
        applicationId,
        "Candidature rejetée par l'administrateur"
      );
      toast.success("Candidature rejetée", {
        description: "La candidature a été rejetée.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du rejet';
      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      navigate("/admin/login");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications.filter(
    (application) =>
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (application.email &&
        application.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (application.phone &&
        application.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      application.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administration Eklart</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Connecté en tant que <strong>{admin?.full_name}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xs bg-white hover:bg-background"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="flex justify-between items-center mb-8">
          <Input
            placeholder="Rechercher..."
            className="max-w-xs rounded-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6 rounded-xs">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 rounded-xs"
            >
              <Users className="w-4 h-4" /> Utilisateurs
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 rounded-xs"
            >
              <Package className="w-4 h-4" /> Catégories
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="flex items-center gap-2 rounded-xs"
            >
              <UserCheck className="w-4 h-4" />
              Demandes {applications.length > 0 && `(${applications.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="rounded-xs">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des utilisateurs ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">ID</th>
                        <th className="text-left p-4 font-medium">Nom</th>
                        <th className="text-left p-4 font-medium">
                          Identifiant
                        </th>
                        <th className="text-left p-4 font-medium">Rôle</th>
                        <th className="text-left p-4 font-medium">
                          Date d'inscription
                        </th>
                        <th className="text-left p-4 font-medium">Statut</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">{user.id}</td>
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4">{user.identifier}</td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "ARTISAN"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(user.joinDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Détails
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>
                                    Détails de l'utilisateur
                                  </SheetTitle>
                                  <SheetDescription>
                                    Informations complètes sur {user.name}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="py-6 space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-medium">ID:</div>
                                    <div>{user.id}</div>
                                    <div className="font-medium">Nom:</div>
                                    <div>{user.name}</div>
                                    <div className="font-medium">
                                      Identifiant:
                                    </div>
                                    <div>{user.identifier}</div>
                                    <div className="font-medium">Rôle:</div>
                                    <div>{user.role}</div>
                                    <div className="font-medium">Statut:</div>
                                    <div>{user.status}</div>
                                    <div className="font-medium">
                                      Date d'inscription:
                                    </div>
                                    <div>
                                      {new Date(
                                        user.joinDate
                                      ).toLocaleDateString("fr-FR")}
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="rounded-xs">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des catégories</CardTitle>
                <Dialog
                  open={isAddCategoryOpen}
                  onOpenChange={setIsAddCategoryOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 rounded-xs">
                      <Plus className="w-4 h-4" />
                      Ajouter une catégorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xs">
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <Label htmlFor="categoryName">
                          Nom de la catégorie
                        </Label>
                        <Input
                          id="categoryName"
                          placeholder="Entrez le nom de la catégorie"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="rounded-xs"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={handleAddCategory} // Use the new handler
                          className="rounded-xs"
                          disabled={!categoryName.trim()}
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Fonctionnalité en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="rounded-xs">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Demandes d'inscription artisan ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredApplications.map((application) => (
                  <Card
                    key={application.id}
                    className="rounded-xs shadow-sm border"
                  >
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {application.name}
                            </h3>
                            <p className="text-sm font-medium text-blue-600">
                              {application.shopName}
                            </p>
                            <div className="text-sm text-gray-600 space-y-1">
                              {application.email && (
                                <p>
                                  <strong>Email:</strong> {application.email}
                                </p>
                              )}
                              {application.phone && (
                                <p>
                                  <strong>Téléphone:</strong>{" "}
                                  {application.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          {application.description && (
                            <div>
                              <p className="text-sm">
                                <strong>Description:</strong>{" "}
                                {application.description.substring(0, 200)}
                                {application.description.length > 200 && "..."}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            Candidature soumise le{" "}
                            {new Date(
                              application.submitDate
                            ).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setSelectedApplication(application)
                                }
                                className="w-full"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Candidature de {selectedApplication?.name}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nom complet</Label>
                                      <p className="font-medium">
                                        {selectedApplication.name}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Nom de la boutique</Label>
                                      <p className="font-medium">
                                        {selectedApplication.shopName}
                                      </p>
                                    </div>
                                    {selectedApplication.email && (
                                      <div>
                                        <Label>Email</Label>
                                        <p className="font-medium">
                                          {selectedApplication.email}
                                        </p>
                                      </div>
                                    )}
                                    {selectedApplication.phone && (
                                      <div>
                                        <Label>Téléphone</Label>
                                        <p className="font-medium">
                                          {selectedApplication.phone}
                                        </p>
                                      </div>
                                    )}
                                    <div className="col-span-2">
                                      <Label>Document d'identité</Label>
                                      <p className="font-medium">
                                        {selectedApplication.identityDocument}
                                      </p>
                                    </div>
                                  </div>
                                  {selectedApplication.description && (
                                    <div>
                                      <Label>Description détaillée</Label>
                                      <p className="mt-1 text-sm leading-relaxed">
                                        {selectedApplication.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            onClick={() =>
                              handleApproveApplication(application.id)
                            }
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 w-full"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="w-full">
                                <X className="h-4 w-4 mr-2" />
                                Rejeter
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Rejeter la candidature
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir rejeter la
                                  candidature de {application.name} ? Cette
                                  action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRejectApplication(application.id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Rejeter
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchQuery
                        ? "Aucune candidature trouvée"
                        : "Aucune candidature en attente"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 