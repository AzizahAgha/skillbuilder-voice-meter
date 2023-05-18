import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import * as React from "react";
import { useEffect } from "react";

const AccountsTemplate = ({ data, onReady }) => {

  useEffect(() => {
    onReady();
  }, []);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.layout}>
          {data?.map((account, idx) => <>
            <Account key={idx} data={account} />
            {idx % 2 === 0 && <View style={styles.divider} />}
          </>)}
        </View>
      </Page>
    </Document>
  );
};

const Account = ({ data }) => <View wrap={false} style={styles.card}>
  <Text style={styles.title}>{data.teamDisplayName}</Text>
  <View style={styles.wrapper}>
    <Text style={styles.label}>Owner</Text>
    <Text style={styles.value}>{`${data.firstName ?? ""} ${data.lastName ?? ""}`}</Text>
  </View>
  <View style={styles.wrapper}>
    <Text style={styles.label}>Email</Text>
    <Text style={styles.value}>{data.email}</Text>
  </View>

  <View style={styles.line} />

  <View style={styles.row}>
    <View style={{ ...styles.wrapper, width: '36%' }}>
      <Text style={styles.label}>Users</Text>
      <Text style={styles.value}>{data.totalUsers}</Text>
    </View>
    <View style={{ ...styles.wrapper, width: '32%' }}>
      <Text style={styles.label}>Questions</Text>
      <Text style={styles.value}>{data.totalQuestions}</Text>
    </View>
    <View style={{ ...styles.wrapper, width: '32%' }}>
      <Text style={styles.label}>Answers</Text>
      <Text style={styles.value}>{data.totalAnswers}</Text>
    </View>
    <View style={{ ...styles.wrapper, width: '36%' }}>
      <Text style={styles.label}>Billing</Text>
      <Text style={styles.value}>{data.billing}</Text>
    </View>
    <View style={{ ...styles.wrapper, width: '32%' }}>
      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>{data.status}</Text>
    </View>
  </View>
</View>;

export const styles = StyleSheet.create({
  page: {
    padding: "20px 0"
  },
  layout: {
    flexDirection: "row",
    width: "90%",
    margin: "auto",
    flexWrap: "wrap",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #81C2C0",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "20px",
    marginBottom: "2%",
    width: "49%",
  },
  title: {
    fontWeight: "Bold",
    fontSize: "20px",
    color: "#003647",
    marginBottom: "4px",
  },
  divider: {
    width: "2%",
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  wrapper: {
    flexDirection: 'row',
    marginBottom: '4px',
  },
  label: {
    fontFamily: 'Helvetica',
    fontSize: "10px",
    color: "#393D3E",
  },
  value: {
    fontFamily: 'Courier',
    fontSize: "10px",
    color: "#393D3E",
    marginLeft: "4px",
  },
  line: {
    borderBottom: "1px solid #81C2C0",
    marginRight: "-21px",
    marginTop: "6px",
    marginBottom: "12px",
    height: "0",
  },
});

export default AccountsTemplate;
