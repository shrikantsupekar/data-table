<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row mt-3">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group has-search">
            <input
              v-model="searchText"
              type="text"
              class="form-control"
              placeholder="Search"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <button
            class="btn btn-success float-right"
            @click="generateRecords(100000)"
            :disabled="loading"
          >
            <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
            Randomize
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Unique ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Job title</th>
                <th scope="col">
                  Country <br />
                  <select v-model="country">
                    <option value="all">All</option>
                    <option :key="c" :value="c" v-for="c in countries">{{
                      c
                    }}</option>
                  </select>
                </th>
                <th scope="col">
                  <span><input v-model="q1" type="checkbox"/></span>Salary for
                  Q1
                </th>
                <th scope="col">
                  <span><input v-model="q2" type="checkbox"/></span>Salary for
                  Q2
                </th>
                <th scope="col">
                  <span><input v-model="q3" type="checkbox"/></span>Salary for
                  Q3
                </th>
                <th scope="col">
                  <span><input v-model="q4" type="checkbox"/></span>Salary for
                  Q4
                </th>
                <th scope="col">Total Quarterly Salary</th>
                <th scope="col">Total working hours</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="e.id" v-for="e in employees">
                <td>{{ e.id }}</td>
                <td>{{ e.firstName }} {{ e.lastName }}</td>
                <td>{{ e.jobTitle }}</td>
                <td>{{ e.emailAddress }}</td>
                <td>{{ e.country }}</td>
                <td>{{ e.salary_q1 }}</td>
                <td>{{ e.salary_q2 }}</td>
                <td>{{ e.salary_q3 }}</td>
                <td>{{ e.salary_q4 }}</td>
                <td>
                  {{ salary(e) }}
                </td>
                <td>
                  {{ workhours(e) }}
                </td>
                <td>
                  <span class="mr-2" @click="viewRecord(e)"
                    ><i class="fa fa-eye"></i
                  ></span>
                  <span class="mr-2" @click="deleteRecord(e)"
                    ><i class="fa fa-trash"></i
                  ></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <nav aria-label="Page navigation example " class="float-right">
            <ul class="pagination">
              <li class="page-item" v-if="page_number > 1">
                <a class="page-link" href="#" @click="page_number = nextPage"
                  >Previous</a
                >
              </li>
              <li
                class="page-item"
                :class="{ active: p === page_number }"
                :key="p"
                v-for="p in pages"
              >
                <a class="page-link" href="#" @click="page_number = p">{{
                  p
                }}</a>
              </li>
              <li class="page-item" v-if="page_number < totalPages">
                <a class="page-link" href="#" @click="page_number = nextPage"
                  >Next</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="modal fade" id="myModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Employee Details</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <h3>{{ viewProfile.firstName }}{{ viewProfile.lastName }}</h3>
            <div><b>Email</b>: {{ viewProfile.emailAddress }}</div>
            <div><b>Job Title</b>: {{ viewProfile.jobTitle }}</div>
            <div><b>Job Title</b>: {{ viewProfile.jobTitle }}</div>
            <div>
              <b>total salary</b>:
              {{
                viewProfile.salary_q1 +
                  viewProfile.salary_q2 +
                  viewProfile.salary_q3 +
                  viewProfile.salary_q4
              }}
            </div>
            <apexchart
              type="line"
              height="350"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import VueApexCharts from "vue-apexcharts";

let timeout;
function debounce(func, wait) {
  clearTimeout(timeout);
  timeout = setTimeout(func, wait);
}

export default {
  name: "App",
  components: { apexchart: VueApexCharts },
  data() {
    return {
      records: [],
      jobTitles: ["manager", "developer", "tester"],
      countries: [
        "India",
        "USA",
        "China",
        "Japan",
        "Russia",
        "Germany",
        "France",
        "Canada",
      ],
      filter: "",
      searchText: "",
      country: "all",
      q1: true,
      q2: true,
      q3: true,
      q4: true,
      page_number: 1,
      page_size: 8,
      pageRange: 3,
      viewProfile: {},
      loading: false,
    };
  },
  computed: {
    employees() {
      return this.records
        .filter((e) => {
          return e.country === this.country || this.country === "all";
        })
        .filter((e) => {
          if (this.filter === "") return true;
          return Object.keys(e).some((p) => {
            return (
              e[p]
                .toString()
                .toUpperCase()
                .indexOf(this.filter.toUpperCase()) > -1 || this.filter === ""
            );
          });
        })
        .slice(
          (this.page_number - 1) * this.page_size,
          this.page_number * this.page_size
        );
    },
    pages() {
      var pages = [];
      for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i);
      }
      return pages;
    },
    rangeStart() {
      var start = this.page_number - this.pageRange;
      return start > 0 ? start : 1;
    },
    rangeEnd() {
      var end = this.page_number + this.pageRange;
      return end < this.totalPages ? end : this.totalPages;
    },
    totalPages() {
      return Math.ceil(this.records.length / this.page_size);
    },
    nextPage() {
      return this.page_number + 1;
    },
    prevPage() {
      return this.page_number - 1;
    },
    series() {
      return [
        {
          name: "Salary",
          type: "column",
          data: this.viewProfile.salary_q1
            ? [
                this.viewProfile.salary_q1,
                this.viewProfile.salary_q2,
                this.viewProfile.salary_q3,
                this.viewProfile.salary_q4,
              ]
            : [],
        },
        {
          name: "Work Hours",
          type: "line",
          data: this.viewProfile.workHours_q1
            ? [
                this.viewProfile.workHours_q1,
                this.viewProfile.workHours_q2,
                this.viewProfile.workHours_q3,
                this.viewProfile.workHours_q4,
              ]
            : [],
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          height: 350,
          type: "line",
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: "Quarters",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
        xaxis: {
          type: "text",
        },
        yaxis: [
          {
            title: {
              text: "Salary",
            },
          },
          {
            opposite: true,
            title: {
              text: "Work Hoours",
            },
          },
        ],
      };
    },
  },
  watch: {
    filter() {
      this.page_number = 1;
    },
    searchText() {
      debounce(() => {
        this.filter = this.searchText;
      }, 1000);
    },
  },
  mounted() {
    this.generateRecords(100000);
  },
  methods: {
    deleteRecord(e) {
      if (window.confirm("Do you really want to delete this record?")) {
        const i = this.records.findIndex((r) => r.id === e.id);
        this.records.splice(i, 1);
      }
    },
    viewRecord(e) {
      this.viewProfile = e;
      $("#myModal").modal("show");
    },
    salary(e) {
      return (
        (this.q1 ? e.salary_q1 : 0) +
        (this.q2 ? e.salary_q2 : 0) +
        (this.q3 ? e.salary_q3 : 0) +
        (this.q4 ? e.salary_q4 : 0)
      );
    },
    workhours(e) {
      return (
        (this.q1 ? e.workHours_q1 : 0) +
        (this.q2 ? e.workHours_q2 : 0) +
        (this.q3 ? e.workHours_q3 : 0) +
        (this.q4 ? e.workHours_q4 : 0)
      );
    },
    generateRecords(numRows = 10) {
      let i = 0;
      let records = [];
      this.loading = true;
      while (i < numRows) {
        let e = {
          id: i + 1,
          firstName: this.generateString(4),
          lastName: this.generateString(4),
          jobTitle: this.jobTitles[
            this.getnerateNumber(0, this.jobTitles.length)
          ],
          country: this.countries[
            this.getnerateNumber(0, this.countries.length)
          ],
          workHours_q1: this.getnerateNumber(500, 800),
          workHours_q2: this.getnerateNumber(500, 800),
          workHours_q3: this.getnerateNumber(500, 800),
          workHours_q4: this.getnerateNumber(500, 800),
        };

        e.emailAddress = e.firstName + "_" + e.lastName + "@xyz.com";
        e.salary_q1 = e.workHours_q1 * 500;
        e.salary_q2 = e.workHours_q2 * 500;
        e.salary_q3 = e.workHours_q3 * 500;
        e.salary_q4 = e.workHours_q4 * 500;
        records.push(e);
        i++;
      }
      this.records = records;
      this.loading = false;
    },
    generateString(length = 4) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },
    getnerateNumber(lowestNumber, highestNumber) {
      return (
        Math.floor(Math.random() * (highestNumber - lowestNumber)) +
        lowestNumber
      );
    },
  },
};
</script>
