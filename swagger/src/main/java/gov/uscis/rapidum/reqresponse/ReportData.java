package gov.uscis.rapidum.reqresponse;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReportData {

    @JsonProperty("Data")
    ArrayList<ReportDataList> Data;

    @JsonProperty("Summary")
    ReportDataSummary Summary;


}
