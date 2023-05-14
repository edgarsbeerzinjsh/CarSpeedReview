﻿// <auto-generated />
using System;
using CarCountAndSpeedReviewApp;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CarCountAndSpeedReviewApp.Migrations
{
    [DbContext(typeof(RoadEntriesDbContext))]
    [Migration("20230510163545_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CarCountAndSpeedReviewApp.Models.RoadEntries", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CarRegistrationNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Speed")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeOfRecord")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("RoadEntries");
                });
#pragma warning restore 612, 618
        }
    }
}
