import React, { useState,useEffect } from 'react';

import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { userData } from '../../UserDataReducer/UserDataSlice';
import { useDispatch } from 'react-redux';

const pastMonth = new Date(2023, 10, 15);


export const DatePicker = () => {
const [isModalVisible, setIsModalVisible] = useState(false);
const dispatch = useDispatch()

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
   
    const defaultSelected: DateRange = {
        from: pastMonth,
        to: addDays(pastMonth, 4)
      };
      const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
      useEffect(()=>{
        // console.log("elsected:", range)
        let date1 = range?.from;
    let date2 = range?.to;
     let Difference_In_Days 
    // To calculate the time difference of two dates
    if(date2 !== undefined && date1 !== undefined){
      
      var Difference_In_Time = date2.getTime() - date1.getTime();
      // To calculate the no. of days between two dates
      Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        
      //To display the final no. of days (result)
      // console.log("Total number of days between dates  <br>"
      //            + date1 + "<br> and <br>" 
      //            + date2 + " is: <br> " 
      //            + Difference_In_Days);
    }
    else{
      console.log("two dates are required")
    }
    localStorage.setItem("NumberOFDays",JSON.stringify(Difference_In_Days))
    localStorage.setItem("DateFrom",JSON.stringify(range?.from))
    localStorage.setItem("DateTo",JSON.stringify(range?.to))

      },[range])
      let footer = <p>Please pick the first day.</p>;
      if (range?.from) {
        if (!range.to) {
          footer = <p>{format(range.from, 'PPP')}</p>;
        } else if (range.to) {
          footer = (
            <p>
              {format(range.from, 'PPP')}–{format(range.to, 'PPP')}
            </p>
          );
        }
      }
    
      return (
        <>
        
        <DayPicker
        
          mode="range"
          defaultMonth={pastMonth}
          selected={range}
          footer={footer}
          onSelect={setRange}
        />
        </>
      );
}
