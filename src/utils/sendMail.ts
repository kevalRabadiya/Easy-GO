// // import transporter from '../configs/mailTransport';
// import dateFormate from'../helper/dateFormatter'

// const mailForBooking = async (_doc:any) => {
//   if(_doc.status==='accepted'){
//     const dateTime = dateFormate(_doc.pickupTime).split(',')
//    return await transporter.sendMail({
//       from: "Ride-With-ME",
//       to: "kevalrabadiya27@gmail.com",
//       subject: "Easy GO🚕",
//       text: "Hello world?",
//       html: `
//       <p>Dear Customer,</p>
//       <p>Your taxi booking has been successfully confirmed.</p>
//       <p>Booking details:</p>
//       <ul>
//         <li>Date: ${dateTime[0]}</li>
//         <li>Time:${dateTime[1]}</li>
//         <li>Pickup Location: ${_doc.pickupLocation}</li>
//         <li>Drop-off Location: ${_doc.dropoffLocation}</li>
//         <li>Driver Name: John Doe</li>
//         <li>Driver Contact: +1234567890</li>
//       </ul>
//       <p>Thank you for choosing our taxi service. Have a safe journey!</p>
//       <p>Best regards,<br>Your Taxi Service Team</p>`,
//     });
//   }
//   else{
//     return;
//   }
// };

// export default  mailForBooking;
