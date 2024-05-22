import { ConfigProvider } from "antd";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const primaryColor = "#8043cc";
  const secondaryColor = "#fde7fe";
  const colorWhite = "#ffffff";
  const colorHover = "#a06ad9";
  const colorGray = '#6b7280';

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 2,
          colorPrimary: primaryColor,

        },

        components: {
          Button: {
            controlHeight: 33,
            controlOutline: "none",
            borderRadius: 5,
            colorBorder: primaryColor,
            colorText: primaryColor,
            defaultHoverBg: colorHover,
            defaultHoverColor: colorWhite,
            colorPrimaryBgHover: secondaryColor,
            colorLinkHover: colorGray,
            linkHoverBg: colorWhite,
          },
          Input: {
            controlHeight: 33,
            controlOutline: "none",
          },
          Modal: {
            titleColor: primaryColor,
          },
          Select: {
            controlHeight: 33,
            controlOutline: "none",
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
