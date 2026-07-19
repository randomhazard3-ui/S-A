import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { RoleProvider } from "@/lib/role-context";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="flex flex-1 min-h-screen bg-bg">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
