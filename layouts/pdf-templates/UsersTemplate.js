import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import * as React from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import moment from "moment";

const UsersTemplate = ({ data, onReady }) => {

  useEffect(() => {
    setTimeout(onReady, 1000);
  }, []);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.layout}>
          <View fixed style={styles.row}>
            <Text style={{ ...styles.header, width: '18%' }}>First Name</Text>
            <Text style={{ ...styles.header, width: '12%' }}>Last Name</Text>
            <Text style={{ ...styles.header, width: '18%' }}>Email</Text>
            <Text style={styles.header}>Title</Text>
            <Text style={styles.header}>Department</Text>
            <Text style={{ ...styles.header, width: '10%' }}>Status</Text>
            <Text style={{ ...styles.header, width: '14%' }}>Last Activity</Text>
          </View>
          <View style={styles.divider} />
          {data.map((user, idx) => (
            <Fragment key={user.userId}>
              <View style={{ ...styles.row, backgroundColor: idx % 2 === 0 ? '#969C9D11' : '#FFFFFF' }}>
                <View style={{ ...styles.row, width: '18%' }}>
                  <Image style={styles.image} cache={false} src={user.avtarurl+"?rnd="+Math.random()} crossorigin="anonymous" />
                  <Text style={styles.text}>{user.firstName}</Text>
                </View>
                <Text style={{ ...styles.entry, width: '12%' }}>{user.lastName}</Text>
                <Text style={{ ...styles.entry, width: '18%' }}>{user.email}</Text>
                <Text style={styles.entry}>{user.title}</Text>
                <Text style={styles.entry}>{user.department}</Text>
                <Text style={{ ...styles.entry, width: '10%' }}>{user.status}</Text>
                <Text style={{ ...styles.entry, width: '14%' }}>
                  {user.lastActivity ? moment(user.lastActivity).format("MMM DD, YYYY"): ""}
                </Text>
              </View>
              <View style={styles.divider} />
            </Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const styles = StyleSheet.create({
  page: {
    padding: "20px 0",
  },
  layout: {
    flexDirection: "column",
    width: "90%",
    margin: "auto",
    minHeight: "100%",
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10px 0'
  },
  header: {
    fontFamily: 'Helvetica',
    fontSize: '11px',
    color: '#003647',
    width: '14%'
  },
  entry: {
    fontFamily: 'Helvetica',
    fontSize: '10px',
    color: '#393D3E',
    width: '14%',
  },
  text: {
    fontFamily: 'Helvetica',
    fontSize: '10px',
    color: '#393D3E',
    textDecoration: 'wrap',
    padding: "0 2px",
    flex:1
  },
  image: {
    border: "0.5px solid #003647",
    width: "16px",
    height: "16px",
    borderRadius: "20px",
    margin: "0 2px"
  },
  divider: {
    border: '0.5px solid #969C9D',
  },
});


export default UsersTemplate;
