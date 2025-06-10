import GitHubIcon from "@/icons/GitHubIcon";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useDemoRouter } from "@toolpad/core/internal";
import { PageContainer, PageHeader, PageHeaderToolbar } from "@toolpad/core/PageContainer";
import dayjs from "dayjs";
import * as React from "react";
//import PageContent from "./PageContent";

const NAVIGATION = [
  { segment: "", title: "Weather" },
  { segment: "orders", title: "Orders" },
];

// preview-start
function CustomPageToolbar({ status }: { status: string }) {
  return (
    <PageHeaderToolbar>
      <p>Current status: {status}</p>
      <Button startIcon={<GitHubIcon />} color="inherit">
        Export
      </Button>

      <DateRangePicker
        sx={{ width: 220 }}
        defaultValue={[dayjs(), dayjs().add(14, "day")]}
        slots={{ field: SingleInputDateRangeField }}
        slotProps={{ field: { size: "small" } as any }}
        label="Period"
      />
    </PageHeaderToolbar>
  );
}

function CustomPageHeader({ status }: { status: string }) {
  const CustomPageToolbarComponent = React.useCallback(
    () => <CustomPageToolbar status={status} />,
    [status],
  );

  return <PageHeader slots={{ toolbar: CustomPageToolbarComponent }} />;
}
// preview-end

export default function ActionsPageContainer({ children }: { children: React.ReactNode }) {
  const router = useDemoRouter();
  const status = "Active";

  const CustomPageHeaderComponent = React.useCallback(
    () => <CustomPageHeader status={status} />,
    [status],
  );
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppProvider navigation={NAVIGATION} router={router} theme={theme}>
        <Paper sx={{ width: "100%" }}>
          <PageContainer slots={{ header: CustomPageHeaderComponent }}>{children}</PageContainer>
        </Paper>
      </AppProvider>
    </LocalizationProvider>
  );
}
