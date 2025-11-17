import {createSlice} from '@reduxjs/toolkit'

const groupsSlice = createSlice({
    name:"groups",
    initialState:{
        doctorGroups:[]
    },
    reducers:{
        addGroup:(state,action) =>{
            state.doctorGroups.push(action.payload)
        },
        removeGroup:(state,action) =>{
            state.doctorGroups = state.doctorGroups.filter(group => group.id !== action.payload)      
         },
         renameGroup:(state,action) => {
            const {id,name} = action.payload;
            const group = state.doctorGroups.find(g => g.id === id)

            if(group){
                group.name = name;
            }
         },
         deleteGroup:(state,action) =>{
            state.doctorGroups = state.doctorGroups.filter(g => g.id !== action.payload)
         },
         updateGroupDoctors:(state,action)=>{
            const {groupId,doctors} = action.payload;
            const group = state.doctorGroups.find(g => g.id === groupId);

            if(group){
                group.doctors = doctors;
            }
         },
         addExpertsToGroup:(state,action) =>{
            const {groupId,doctors} = action.payload;
            const group = state.doctorGroups.find(g => g.id === groupId)

            if(group){
                const uniqueDoctors = doctors.filter(doctor => !group.doctors.some(d => d.Record_Id === doctor.Record_id));
                group.doctors.push(...uniqueDoctors);
            }
         }
    }
})

export const {addGroup,removeGroup, renameGroup,deleteGroup,addExpertsToGroup,updateGroupDoctors} = groupsSlice.actions;

export default groupsSlice.reducer;

