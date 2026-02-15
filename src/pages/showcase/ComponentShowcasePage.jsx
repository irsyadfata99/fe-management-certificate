/**
 * Component Showcase Page
 * Comprehensive showcase of all UI components
 */

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import {
  Button,
  Input,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  Radio,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Modal,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert,
  Spinner,
  LoadingOverlay,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  FormField,
  FormLabel,
  FormError,
  FormHelperText,
} from "@/components/ui";
import {
  Search,
  Download,
  Trash2,
  Plus,
  Mail,
  Lock,
  User,
  Calendar,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/helpers/cn";

export default function ComponentShowcasePage() {
  const { sidebarCollapsed } = useUIStore();

  // State untuk demo components
  const [activeTab, setActiveTab] = useState("buttons");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("");

  // Demo data
  const multiSelectOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
  ];

  const tableData = [
    { id: 1, name: "John Doe", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Teacher", status: "Active" },
    { id: 3, name: "Bob Johnson", role: "Teacher", status: "Inactive" },
  ];

  const tabs = [
    { id: "buttons", label: "Buttons" },
    { id: "inputs", label: "Form Inputs" },
    { id: "cards", label: "Cards & Badges" },
    { id: "tables", label: "Tables" },
    { id: "modals", label: "Modals & Alerts" },
    { id: "loading", label: "Loading States" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-64",
          sidebarCollapsed && "lg:ml-20",
        )}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-16">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Component Showcase
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Comprehensive showcase of all UI components with Sidebar &
                Navbar
              </p>
            </div>

            {/* Tabs Navigation */}
            <Card>
              <CardContent className="p-4">
                <TabsList>
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* BUTTONS TAB */}
              <TabsContent active={activeTab === "buttons"}>
                <Card>
                  <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>
                      All button styles and sizes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Variants */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        Variants
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                      </div>
                    </div>

                    {/* Sizes */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        Sizes
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                        <Button size="xl">Extra Large</Button>
                      </div>
                    </div>

                    {/* With Icons */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        With Icons
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button leftIcon={<Plus className="w-4 h-4" />}>
                          Add New
                        </Button>
                        <Button
                          variant="secondary"
                          rightIcon={<Download className="w-4 h-4" />}
                        >
                          Download
                        </Button>
                        <Button
                          variant="danger"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* States */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        States
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button loading>Loading</Button>
                        <Button disabled>Disabled</Button>
                        <Button fullWidth>Full Width</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FORM INPUTS TAB */}
              <TabsContent active={activeTab === "inputs"}>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Text Inputs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Text Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField>
                        <FormLabel htmlFor="input-basic">Basic Input</FormLabel>
                        <Input
                          id="input-basic"
                          placeholder="Enter text..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="input-icon">With Icon</FormLabel>
                        <Input
                          id="input-icon"
                          placeholder="Search..."
                          leftIcon={<Search className="w-4 h-4" />}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="input-error" required>
                          With Error
                        </FormLabel>
                        <Input
                          id="input-error"
                          placeholder="Email"
                          leftIcon={<Mail className="w-4 h-4" />}
                          error
                          helperText="Please enter a valid email"
                        />
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="input-password">Password</FormLabel>
                        <Input
                          id="input-password"
                          type="password"
                          placeholder="Password"
                          leftIcon={<Lock className="w-4 h-4" />}
                          helperText="Must be at least 8 characters"
                        />
                      </FormField>
                    </CardContent>
                  </Card>

                  {/* Select & Textarea */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Select & Textarea</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField>
                        <FormLabel htmlFor="select-basic">Select</FormLabel>
                        <Select
                          id="select-basic"
                          value={selectValue}
                          onChange={(e) => setSelectValue(e.target.value)}
                          placeholder="Choose option..."
                        >
                          <option value="1">Option 1</option>
                          <option value="2">Option 2</option>
                          <option value="3">Option 3</option>
                        </Select>
                      </FormField>

                      <FormField>
                        <FormLabel>Multi Select</FormLabel>
                        <MultiSelect
                          options={multiSelectOptions}
                          value={multiSelectValue}
                          onChange={setMultiSelectValue}
                          placeholder="Select multiple..."
                        />
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="textarea-basic">Textarea</FormLabel>
                        <Textarea
                          id="textarea-basic"
                          placeholder="Enter description..."
                          value={textareaValue}
                          onChange={(e) => setTextareaValue(e.target.value)}
                          rows={4}
                        />
                      </FormField>
                    </CardContent>
                  </Card>

                  {/* Checkboxes & Radios */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Checkboxes & Radios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Checkboxes</h4>
                        <div className="space-y-2">
                          <Checkbox
                            label="Accept terms and conditions"
                            checked={checkboxChecked}
                            onChange={(e) =>
                              setCheckboxChecked(e.target.checked)
                            }
                          />
                          <Checkbox
                            label="Subscribe to newsletter"
                            description="Get updates about new features"
                          />
                          <Checkbox
                            label="With error"
                            error
                            helperText="This field is required"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Radio Buttons
                        </h4>
                        <div className="space-y-2">
                          <Radio
                            name="radio-group"
                            value="option1"
                            label="Option 1"
                            checked={radioValue === "option1"}
                            onChange={(e) => setRadioValue(e.target.value)}
                          />
                          <Radio
                            name="radio-group"
                            value="option2"
                            label="Option 2"
                            description="With description"
                            checked={radioValue === "option2"}
                            onChange={(e) => setRadioValue(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* CARDS & BADGES TAB */}
              <TabsContent active={activeTab === "cards"}>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Card Variants */}
                  <div className="space-y-4">
                    <Card variant="default">
                      <CardHeader>
                        <CardTitle>Default Card</CardTitle>
                        <CardDescription>Standard card style</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          This is a default card with border and shadow.
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle>Glass Card</CardTitle>
                        <CardDescription>Glassmorphism effect</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Card with backdrop blur and transparency.
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle>Elevated Card</CardTitle>
                        <CardDescription>With hover effect</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Hover to see the shadow transition.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Badges */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Badge Variants</CardTitle>
                      <CardDescription>Status indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Variants</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default">Default</Badge>
                          <Badge variant="primary">Primary</Badge>
                          <Badge variant="success">Success</Badge>
                          <Badge variant="warning">Warning</Badge>
                          <Badge variant="danger">Danger</Badge>
                          <Badge variant="info">Info</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Sizes</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge size="sm">Small</Badge>
                          <Badge size="md">Medium</Badge>
                          <Badge size="lg">Large</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Use Cases</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Status:</span>
                            <Badge variant="success">Active</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Role:</span>
                            <Badge variant="primary">Admin</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Priority:</span>
                            <Badge variant="danger">High</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* TABLES TAB */}
              <TabsContent active={activeTab === "tables"}>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Table</CardTitle>
                    <CardDescription>
                      Table with sorting and pagination
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead align="right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Badge variant="primary" size="sm">
                                {row.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  row.status === "Active"
                                    ? "success"
                                    : "default"
                                }
                                size="sm"
                              >
                                {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell align="right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost">
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost">
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={5}
                      onPageChange={setCurrentPage}
                      showInfo
                      totalItems={50}
                      itemsPerPage={10}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MODALS & ALERTS TAB */}
              <TabsContent active={activeTab === "modals"}>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Modals */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Modals</CardTitle>
                      <CardDescription>Dialog components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button onClick={() => setModalOpen(true)}>
                        Open Modal
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setLoadingOverlay(true)}
                      >
                        Show Loading Overlay
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts</CardTitle>
                      <CardDescription>Notification banners</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Alert variant="info" title="Info Alert">
                        This is an informational message.
                      </Alert>
                      <Alert variant="success" title="Success!">
                        Your action was completed successfully.
                      </Alert>
                      <Alert variant="warning" title="Warning">
                        Please review this carefully.
                      </Alert>
                      <Alert variant="danger" title="Error">
                        Something went wrong.
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* LOADING STATES TAB */}
              <TabsContent active={activeTab === "loading"}>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Spinners */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Spinners</CardTitle>
                      <CardDescription>Loading indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4">
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                        <Spinner size="xl" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skeletons */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skeletons</CardTitle>
                      <CardDescription>Content placeholders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <SkeletonText lines={3} />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skeleton Card */}
                  <SkeletonCard />
                </div>
              </TabsContent>
            </div>
          </div>
        </main>
      </div>

      {/* Demo Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        description="This is a demonstration of the modal component"
        size="md"
        footer={
          <ModalFooter
            onCancel={() => setModalOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setModalOpen(false);
            }}
            cancelText="Cancel"
            confirmText="Confirm"
          />
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This modal demonstrates the full-featured modal component with header,
          content, and footer sections. You can customize the size, add custom
          footer actions, and control backdrop behavior.
        </p>
      </Modal>

      {/* Loading Overlay */}
      <LoadingOverlay show={loadingOverlay} message="Processing..." />

      {/* Auto-close loading overlay */}
      {loadingOverlay && setTimeout(() => setLoadingOverlay(false), 2000)}
    </div>
  );
}
