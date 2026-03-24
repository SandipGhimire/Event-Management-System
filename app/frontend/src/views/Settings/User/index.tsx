import ContentLayout from "@/components/common/ContentLayout";

export default function User() {
  return (
    <>
      <ContentLayout
        header="Content Title"
        buttons={[
          {
            label: "Add",
            onClick: () => {
              alert("click");
            },
            className: "btn-primary",
          },
        ]}
      >
        <div>Content</div>
      </ContentLayout>
    </>
  );
}
