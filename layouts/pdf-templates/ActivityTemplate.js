import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React, { useEffect } from "react";

const Widths = {
  SerialNo: '5%',
  User: '30%',
  Other: '12%',
};

const UserActivity = ({ data, onReady, stats }) => {

  useEffect(onReady, []);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.layout}>
          <Text style={styles.dateRange}>Values below are from
            [{stats?.dateRange?.start ?? 'MM/DD/YY'} - {stats?.dateRange?.end ?? 'MM/DD/YY'}]</Text>
          <View style={styles.statsRow}>
            {stats?.data?.map(stat => <View key={stat.label} style={styles.stat}>
              <Text style={styles.statText}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>)}
          </View>

          <View style={styles.table}>
            <View fixed style={styles.headerRow}>
              <Text style={{ ...styles.header, textAlign: 'center', width: Widths.SerialNo }}>#</Text>
              <Text style={{ ...styles.header, width: Widths.User }}>User</Text>
              <Text style={styles.header}>Questions</Text>
              <Text style={styles.header}>Answers</Text>
              <Text style={styles.header}>Requests</Text>
              <Text style={styles.header}>Agrees</Text>
              <Text style={styles.header}>Disagrees</Text>
              <Text style={styles.header}>Flags</Text>
              <Text style={styles.header}>Total</Text>
            </View>

            {data?.map((user, idx) => <View wrap={false} key={idx}>
              <View style={styles.entryRow}>
                <Text style={{ ...styles.entry, width: Widths.SerialNo }}>{`${idx + 1}`?.padStart(2, '0')}</Text>
                <View style={styles.user}>
                  <Image style={styles.image} cache={false} src={user.userProfileUrl+"?rnd="+Math.random()} crossorigin="anonymous"/>
                  <View style={styles.content}>
                    <Text style={{ ...styles.text, fontFamily: 'Helvetica-Bold' }}>
                      {`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    </Text>
                    {user.title ? <Text style={styles.text}>
                      {`${user.title} | ${user.department ?? ""}`}
                    </Text> : null}
                  </View>
                </View>
                <Text style={styles.entry}>{user.totalQuestions}</Text>
                <Text style={styles.entry}>{user.totalAnswers}</Text>
                <Text style={styles.entry}>{user.totalRequests}</Text>
                <Text style={styles.entry}>{user.totalLikes}</Text>
                <Text style={styles.entry}>{user.totalDislikes}</Text>
                <Text style={styles.entry}>{user.totalFlags}</Text>
                <Text style={styles.entry}>{user.total}</Text>
              </View>
              <View style={styles.divider} />
            </View>)}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const styles = StyleSheet.create({
  page: {
    padding: "20px 0"
  },
  layout: {
    flexDirection: "column",
    width: "90%",
    minHeight: "100%",
    margin: "auto",
  },
  table: {
    border: "1px solid #000000",
    paddingBottom: "1%"
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: "4px",
    backgroundColor: "#969C9D22",
    padding: "13px 0",
  },
  header: {
    width: Widths.Other,
    marginLeft: "4px",
    fontSize: '10px',
    color: '#1F5462',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold'
  },
  entryRow: {
    flexDirection: "row",
    margin: '20px 0',
    alignItems: 'center'
  },
  entry: {
    width: Widths.Other,
    marginLeft: '4px',
    fontSize: '10px',
    textAlign: 'center',
    color: '#003647',
    flexWrap: 'wrap'
  },
  user: {
    flexDirection: 'row',
    width: Widths.User,
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: '4px',
  },
  image: {
    border: '0.5px solid #003647',
    width: '16px',
    height: '16px',
    borderRadius: '25px'
  },
  text: {
    fontSize: '10px',
    color: '#1F5462',
    flexWrap: 'wrap'
  },
  divider: {
    borderBottom: '1px solid #888',
    marginLeft: '2%',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: '32px',
    justifyContent: 'center'
  },
  stat: {
    flexDirection: 'column',
    alignItems: 'center',
    width: "16%",
  },
  statText: {
    fontSize: '40px',
    color: '#003647'
  },
  statLabel: {
    fontSize: '12px',
    color: '#003647'
  },
  dateRange: {
    fontFamily: 'Helvetica-Bold',
    fontSize: '12px',
    color: '#003647',
    marginBottom: '2%',
    textAlign: 'left'
  }
});

export default UserActivity;
