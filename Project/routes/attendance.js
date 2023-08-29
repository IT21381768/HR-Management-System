const router = require("express").Router();
const Attendance = require("../models/attendance");


//add attendance
router.post('/add', (req, res) => {
    Attendance.create(req.body)
      .then(attendance => res.json({ msg: 'Attendance added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this Attendance' }));
});


//get attendance
router.get('/', (req, res) => {
    Attendance.find()
        .then(attendance => res.json(attendance))
        .catch(err => res.status(400).json({ error: 'Unable to get Attendance' }));
}
);

//get attendance by id
router.get('/:id', async (req, res) => {
  try {
      const attendanceId = req.params.id;
      const attendance = await Attendance.findById(attendanceId);
      
      if (!attendance) {
          return res.status(404).json({ message: 'Attendance not found' });
      }

      res.status(200).json(attendance);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

//get own attendance
router.get('/own/:empNo', (req, res) => {
  const empNo = req.params.empNo;

  Attendance.find({ empNo: empNo }) 
    .then(attendance => res.json(attendance))
    .catch(err => res.status(400).json({ error: 'Unable to get Attendance' }));
});


//update attendance
router.put('/update/:id', (req, res) => {
    Attendance.findByIdAndUpdate(req.params.id, req.body)
      .then(attendance => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
  });





  router.put('/:id/checkout', async (req, res) => {
    try {
        const attendanceId = req.params.id;
        const newCheckOut = req.body.checkOut; // Assuming you send this in the request body

        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        attendance.attendance[0].checkOut = newCheckOut; // Assuming you want to update the first attendance record
        await attendance.save();

        res.status(200).json({ message: 'Check-out time updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating check-out time', error: error.message });
    }
});


router.get('/attendance/check', (req, res) => {
    const { empNo, date } = req.query;

    const existingRecord = checkInRecords.find(record => record.empNo === empNo && record.date === date);

    if (existingRecord) {
        return res.json({ exists: true });
    }

    return res.json({ exists: false });
});

//   router.put('/update-checkout/:attendanceId/:entryId', async (req, res) => {
//     const { attendanceId, entryId } = req.params;
//     const { checkOut } = req.body;

//     try {
//         const attendanceEntry = await Attendance.findOneAndUpdate(
//             { _id: attendanceId, "attendance._id": entryId },
//             { $set: { "attendance.$.checkOut": checkOut } },
//             { new: true }
//         );

//         if (!attendanceEntry) {
//             return res.status(404).json({ message: 'Attendance entry not found' });
//         }

//         return res.json(attendanceEntry);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred' });
//     }
// });

 module.exports = router; 
