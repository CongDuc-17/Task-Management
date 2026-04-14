import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useParams } from "react-router";
import { X } from "lucide-react";

export function MembersBoard({
  boardMembers,
  fetchBoard,
}: {
  boardMembers?: any[];
  fetchBoard: () => Promise<void>;
}) {
  const { boardId } = useParams() as { boardId: string };
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>({});

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  async function fetchRoles() {
    try {
      const response = await apiClient.get("/roles");

      const projectRoles = response.data.filter((role: any) =>
        role.name.startsWith("BOARD_"),
      );
      setRoles(projectRoles);
      return projectRoles;
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }
  useEffect(() => {
    fetchRoles();
  }, []);

  async function handleUpdateMemberRole(userId: string, newRoleId: string) {
    try {
      const response = await apiClient.patch(`/boards/${boardId}/members`, {
        userId: userId,
        roleId: newRoleId,
      });
      setMemberRoles((prev) => ({ ...prev, [userId]: newRoleId }));
    } catch (error) {
      console.error("Error changing role:", error);
    }
  }

  async function handleInvite() {
    console.log("Inviting email:", email, "to boardId:", boardId);
    if (!validateEmail(email)) {
      return;
    }

    if (!selectedRoleId || selectedRoleId === "") {
      alert("Please select a role");
      return;
    }

    try {
      const response = await apiClient.post(`/invitations/boards/${boardId}`, {
        email,
        roleId: selectedRoleId,
      });

      setEmail("");
      setSelectedRoleId("");
      await fetchBoard();
      console.log("Invitation response:", response);
    } catch (error) {
      console.error("Error inviting member:", error);
      alert("Error inviting member");
    }
  }

  async function handleRemoveMember(userId: string) {
    try {
      await apiClient.delete(`/boards/${boardId}/members`, {
        data: { userId },
      });
      await fetchBoard();
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member");
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="flex flex-row flex-wrap items-center pr-4 gap-6 md:gap-12">
            <AvatarGroup className="grayscale">
              {boardMembers &&
                boardMembers?.slice(0, 3).map((member, index) => (
                  <Avatar key={index}>
                    <AvatarImage
                      src={member.user.avatar}
                      alt={member.user.name}
                    />
                    <AvatarFallback>
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              {boardMembers && boardMembers.length > 3 && (
                <AvatarGroupCount>+{boardMembers.length - 3}</AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]  max-h-[650px] ">
          <DialogHeader>
            <DialogTitle>Board Members</DialogTitle>
            <DialogDescription>
              View and manage board members here.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="email-1">Email new member</Label>
              <Input
                id="email-1"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name.replace("BOARD_", "")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleInvite}>Invite</Button>
          </DialogFooter>

          {/* members */}
          <div className="max-h-[300px] overflow-y-auto">
            {boardMembers?.map((member, index) => (
              <Card
                key={index}
                className="mb-2 flex flex-row justify-between items-center gap-4 p-4"
              >
                <div className="flex items-center">
                  <Avatar key={index}>
                    <AvatarImage
                      src={member.user.avatar}
                      alt={member.user.name}
                    />
                    <AvatarFallback>
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-bold">{member.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={memberRoles[member.user.id] || member.role.id}
                    onValueChange={(newRoleId) =>
                      handleUpdateMemberRole(member.user.id, newRoleId)
                    }
                    disabled={member.role.name === "BOARD_ADMIN"}
                  >
                    <SelectTrigger className="w-fit">
                      <SelectValue
                        placeholder={member.role.name.replace("BOARD_", "")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name.replace("BOARD_", "")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <X
                    className="cursor-pointer text-gray-400 hover:text-red-500 transition"
                    onClick={() => handleRemoveMember(member.user.id)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
