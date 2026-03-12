export function HeaderBoard({
  boardId,
  boardName,
}: {
  boardId: string;
  boardName?: string;
}) {
  return (
    <div className="fixed w-full bg-white z-10 shadow-md">
      <h1 className="text-2xl font-bold p-4 ">{boardName}</h1>
      <hr />
    </div>
  );
}
